import { NextRequest, NextResponse } from 'next/server';
import { TursoObservabilitySDK } from '@a24z/observability-sdk';

export const dynamic = 'force-dynamic';

interface GitCommand {
  command: string;
  timestamp: number;
  timestampMs: number;
  success: boolean;
  type: 'commit' | 'push' | 'pull' | 'checkout' | 'branch' | 'merge' | 'other';
  commitMessage?: string; // Extracted from git commit commands
}

interface SessionGitActivity {
  sessionId: string;
  hasGitCommands: boolean;
  gitCommands: GitCommand[];
  commitCount: number;
  pushCount: number;
  commitMessages: string[]; // Array of commit messages from this session
  commitSHAs: string[]; // SHAs that were created during this session
  repositoryContext?: {
    branch?: string;
    commit?: string;
    remoteUrl?: string;
  };
}

/**
 * Detect the type of git command
 */
function detectGitCommandType(command: string): GitCommand['type'] {
  const lowerCommand = command.toLowerCase();
  if (lowerCommand.includes('git commit')) return 'commit';
  if (lowerCommand.includes('git push')) return 'push';
  if (lowerCommand.includes('git pull')) return 'pull';
  if (lowerCommand.includes('git checkout')) return 'checkout';
  if (lowerCommand.includes('git branch')) return 'branch';
  if (lowerCommand.includes('git merge')) return 'merge';
  return 'other';
}

/**
 * Extract bash command from toolInput JSON
 */
function extractBashCommand(toolInput: string): string | null {
  try {
    const input = JSON.parse(toolInput);
    return input.command || null;
  } catch (error) {
    return null;
  }
}

/**
 * Extract commit message from git commit command
 * Handles both -m "message" and heredoc formats
 */
function extractCommitMessage(command: string): string | null {
  // Match heredoc format: git commit -m "$(cat <<'EOF'\nmessage\nEOF\n)"
  const heredocMatch = command.match(/git\s+commit[^"]*"\$\(cat\s+<<'EOF'([\s\S]*?)EOF\s*\)"/);
  if (heredocMatch) {
    return heredocMatch[1].trim();
  }

  // Match simple -m "message" format
  const simpleMatch = command.match(/git\s+commit[^"]*-m\s+"([^"]+)"/);
  if (simpleMatch) {
    return simpleMatch[1];
  }

  return null;
}

/**
 * GET /api/agent-events/session-git-activity?sessionId={sessionId}
 * Returns git command activity for a specific session
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json(
        {
          error: 'Missing parameters',
          message: 'sessionId parameter is required',
        },
        { status: 400 }
      );
    }

    const tursoUrl = process.env.TURSO_DATABASE_URL;
    const tursoAuthToken = process.env.TURSO_AUTH_TOKEN;

    if (!tursoUrl || !tursoAuthToken) {
      return NextResponse.json(
        {
          error: 'Database configuration missing',
          message: 'TURSO_DATABASE_URL and TURSO_AUTH_TOKEN must be configured'
        },
        { status: 500 }
      );
    }

    const sdk = TursoObservabilitySDK.createCloud(tursoUrl, tursoAuthToken);

    // Query pre_hook_logs for Bash tool calls
    const preHookResult = await sdk.execute(
      `SELECT
        tool_call_id,
        tool_name,
        tool_input,
        timestamp
       FROM pre_hook_logs
       WHERE session_id = ? AND tool_name = 'Bash'
       ORDER BY timestamp ASC`,
      [sessionId]
    ) as { rows?: any[] };

    // Query post_hook_logs for success status
    const postHookResult = await sdk.execute(
      `SELECT
        tool_call_id,
        success
       FROM post_hook_logs
       WHERE session_id = ?`,
      [sessionId]
    ) as { rows?: any[] };

    // Create a map of tool_call_id to success status
    const successMap = new Map<string, boolean>();
    (postHookResult.rows || []).forEach((row: any) => {
      successMap.set(row.tool_call_id, Boolean(row.success));
    });

    // Process bash commands to find git commands
    const gitCommands: GitCommand[] = [];
    (preHookResult.rows || []).forEach((row: any) => {
      const command = extractBashCommand(row.tool_input);
      if (command && command.trim().startsWith('git')) {
        const type = detectGitCommandType(command);
        const gitCommand: GitCommand = {
          command,
          timestamp: Number(row.timestamp),
          timestampMs: Number(row.timestamp) * 1000,
          success: successMap.get(row.tool_call_id) ?? false,
          type,
        };

        // Extract commit message if this is a commit command
        if (type === 'commit') {
          const commitMessage = extractCommitMessage(command);
          if (commitMessage) {
            gitCommand.commitMessage = commitMessage;
          }
        }

        gitCommands.push(gitCommand);
      }
    });

    // Get all repository contexts from normalized_events to track commit SHA changes
    const contextResult = await sdk.execute(
      `SELECT repository_context, timestamp
       FROM normalized_events
       WHERE session_id = ? AND repository_context IS NOT NULL
       ORDER BY timestamp ASC`,
      [sessionId]
    ) as { rows?: any[] };

    let repositoryContext: { branch?: string; commit?: string; remoteUrl?: string } | undefined = undefined;
    const commitSHAs = new Set<string>();

    if (contextResult.rows && contextResult.rows.length > 0) {
      // Track unique commit SHAs throughout the session
      contextResult.rows.forEach((row: any) => {
        try {
          const ctx = JSON.parse(row.repository_context);
          if (ctx.headCommit) {
            commitSHAs.add(ctx.headCommit);
          }
          // Use the first context as the representative one
          if (!repositoryContext) {
            repositoryContext = ctx;
          }
        } catch (error) {
          console.error('Failed to parse repository_context:', error);
        }
      });
    }

    await sdk.close();

    const commitCount = gitCommands.filter(cmd => cmd.type === 'commit').length;
    const pushCount = gitCommands.filter(cmd => cmd.type === 'push').length;

    // Extract commit messages from commit commands
    const commitMessages = gitCommands
      .filter(cmd => cmd.type === 'commit' && cmd.commitMessage)
      .map(cmd => cmd.commitMessage!);

    const activity: SessionGitActivity = {
      sessionId,
      hasGitCommands: gitCommands.length > 0,
      gitCommands,
      commitCount,
      pushCount,
      commitMessages,
      commitSHAs: Array.from(commitSHAs),
      repositoryContext,
    };

    return NextResponse.json(activity);
  } catch (error) {
    console.error('[API] Error fetching session git activity:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch session git activity',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Mock environment variables
process.env.AWS_REGION = 'us-east-1'
process.env.EMAIL_LIST_S3_BUCKET = 'test-bucket'

// Mock AWS SDK
jest.mock('@aws-sdk/client-s3', () => {
  const mockS3Client = {
    send: jest.fn(),
  }
  
  return {
    S3Client: jest.fn(() => mockS3Client),
    GetObjectCommand: jest.fn(),
    PutObjectCommand: jest.fn(),
    ListObjectsV2Command: jest.fn(),
    DeleteObjectCommand: jest.fn(),
  }
})

// Mock fetch globally
global.fetch = jest.fn()

// Setup and teardown
beforeEach(() => {
  jest.clearAllMocks()
  global.fetch.mockClear()
})

afterEach(() => {
  jest.resetAllMocks()
})
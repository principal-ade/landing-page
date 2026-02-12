export interface RevealedCell {
  col: number;
  row: number;
}

export interface BlockageWall {
  type: 'vertical' | 'horizontal';
  col?: number;
  row?: number;
  col1?: number;
  col2?: number;
  row1?: number;
  row2?: number;
}

export type GameMode = 'start' | 'initial' | 'conventional' | 'principal';

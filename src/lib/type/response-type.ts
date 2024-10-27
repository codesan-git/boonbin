export type ApiResponse<TType> = {
  responseCode: number;
  responseMessage: string;
  responseDateTime: Date;
  result: TType;
};

export type ApiResponseArray<TType> = {
  responseCode: number;
  responseMessage: string;
  responseDateTime: Date;
  result: Array<TType>;
};

// Tipe untuk Prisma error
export type PrismaError = {
  code: string;
  clientVersion: string;
}
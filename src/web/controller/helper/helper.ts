export const skipLimitParser = async (skip = 0, limit = 25): Promise<{ skip: number; limit: number }> => {
    skip = skip < 0 ? 0 : skip;
    limit = limit <= 0 ? 25 : limit > 25 ? 25 : limit;
    return { skip, limit };
};
type PromiseType<T> = T extends Promise<infer R> ? R : T;
type FetchFunction = (...args: any[]) => any;
type FetchResponse<T> =
    | {
          data: PromiseType<T>;
          success: true;
          message: null;
      }
    | {
          data: null;
          success: false;
          message: string | null;
      };

export default function withFetchResponse<
    F extends FetchFunction,
    P extends Parameters<F>,
    R extends ReturnType<F>
>(func: F) {
    return async function fetchResponse(...args: P): Promise<FetchResponse<R>> {
        try {
            const data = await func(...args);
            return { data, success: true, message: null };
        } catch (err) {
            return {
                data: null,
                success: false,
                message: err.message || null,
            };
        }
    };
}

export const get = Symbol("get");
export const set = Symbol("set");

export interface Lens<T, V> {
  [get]: (o: T) => V;
  [set]: (v: V) => (t: T) => T;
}

export const identity = <T>(): Lens<T, T> => ({
  [get]: t => t,
  [set]: v => t => v
});

const property = <T, K extends keyof T>(k: K): Lens<T, T[K]> => ({
  [get]: (t: T): T[K] => t[k],
  [set]: (v: T[K]) => (t: T): T => ({ ...(t as any), [k]: v })
});

type PropertiesLens<P, T> = Lens<P, T> &
  { [K in keyof T]: PropertiesLens<P, T[K]> };

export const properties = <T>(): PropertiesLens<T, T> =>
  propertiesRecursive(identity());

const propertiesRecursive = <P, T>(p: Lens<P, T>): PropertiesLens<P, T> =>
  new Proxy(p, {
    get(o, k) {
      if (k === get || k === set) {
        return p[k];
      } else if (typeof k === "string") {
        return propertiesRecursive(
          compose(
            p,
            property(k as any)
          )
        );
      } else {
        return o[k];
      }
    }
  }) as PropertiesLens<P, T>;

export const compose = <A, B, C>(x: Lens<A, B>, y: Lens<B, C>): Lens<A, C> => ({
  [get]: (a: A) => y[get](x[get](a)),
  [set]: (c: C) => (a: A) => {
    const b: B = x[get](a);
    const b2: B = y[set](c)(b);
    return x[set](b2)(a);
  }
});

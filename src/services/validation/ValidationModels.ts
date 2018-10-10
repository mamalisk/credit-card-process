export type Validation<T> = (t: T) => boolean;

export interface Predicate<T> {
    value: T;
    statement: (t: T) => boolean;
}

export class Validator<T> {

    performAllChecks(...predicates: Predicate<T>[]): boolean {
        return predicates.map((p) => p.statement(p.value)).reduce((prev, next) => prev && next);
    }
}


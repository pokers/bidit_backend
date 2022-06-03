export enum ErrorString {
    FirstLastNotSupported = 'Passing both `first` and `last` is not supported.',
}

export const ErrorFirstLastNotSupported = ()=> new Error(ErrorString.FirstLastNotSupported);


  
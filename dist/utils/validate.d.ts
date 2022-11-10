interface IObject {
    [key: string]: any;
    [key: number]: any;
}
declare type TValidate = (val: any, row: IObject, column: IColumn) => string | null;
interface IColumn {
    title: string;
    column: string;
    validate?: Array<TValidate> | TValidate;
}
/**
 *
 * @param columns 字段
 * @param formData
 */
declare const validateForm: (columns: Array<IColumn>, formData: any) => {};
declare const validateRequired: (val: any, row: IObject, column: IColumn) => string;
declare const validateGtZero: (val: any, row: IObject, column: IColumn) => string;
declare const validateGteZero: (val: any, row: IObject, column: IColumn) => string;
declare const validatePhone: (val: any, row: IObject, column: IColumn) => string;
declare const validateEmail: (val: any, row: IObject, column: IColumn) => string;

export { IColumn, IObject, TValidate, validateEmail, validateForm, validateGtZero, validateGteZero, validatePhone, validateRequired };

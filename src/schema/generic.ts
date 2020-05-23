import { Validator, ValidationError, Schema } from 'jsonschema';
export { Schema } from 'jsonschema';

const validator = new Validator();

export abstract class GenericSchemaValidator
{
    private valid: boolean;
    private errors: string[];

    public constructor(data: any)
    {
        const result = validator.validate(data, this.getValidationSchema());

        this.valid  = result.valid;
        this.errors = result.errors.map((err: ValidationError): string => {
            return err.message;
        });
    }

    protected abstract getValidationSchema(): Schema;
    public isValid(): boolean { return this.valid; }
    public getErrors(): string[] { return this.errors; }
}

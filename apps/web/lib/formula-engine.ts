import { Parser } from 'expr-eval';
import { IDatabaseRow, IProperty, PagePropertyType } from '@masar/types';

export class FormulaEngine {
  private static parser = new Parser();

  /**
   * Evaluates a formula expression given a row and the database properties schema.
   * Properties can be referenced in the expression by their names (e.g., "Price" * "Quantity").
   */
  static evaluate(expression: string, row: IDatabaseRow, properties: IProperty[]): string | number | null {
    if (!expression || expression.trim() === '') {
      return null;
    }

    try {
      // Build a context object where keys are property names and values are the cell data
      const context: Record<string, any> = {};

      properties.forEach((prop) => {
        // Only include numeric or text values in context for formulas
        if (
          prop.type === PagePropertyType.NUMBER ||
          prop.type === PagePropertyType.TEXT ||
          prop.type === PagePropertyType.FORMULA
        ) {
          const rawValue = row.data?.[prop.id];
          
          // Try to convert to number if possible for numeric operations
          if (rawValue !== undefined && rawValue !== null && rawValue !== '') {
            const numValue = Number(rawValue);
            context[prop.name] = isNaN(numValue) ? rawValue : numValue;
          } else {
             // Default to 0 for empty numbers to avoid NaN errors in basic math
             context[prop.name] = prop.type === PagePropertyType.NUMBER ? 0 : '';
          }
        }
      });

      // Parse and evaluate the expression using the built context
      const result = this.parser.evaluate(expression, context);

      // Return a clean number or string
      if (typeof result === 'number') {
        // Round to 2 decimal places if it's a float, else return as is
        return Number.isInteger(result) ? result : Number(result.toFixed(2));
      }
      return result;
    } catch (error) {
      console.warn(`Formula evaluation failed for expression: "${expression}"`, error);
      return 'Error';
    }
  }
}

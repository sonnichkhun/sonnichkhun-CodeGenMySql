import { IdFilter, StringFilter } from 'core/filters';
import { ModelFilter } from 'core/models';

export class VariationFilter extends ModelFilter {
  public id?: IdFilter = new IdFilter();
  public code?: StringFilter = new StringFilter();
  public name?: StringFilter = new StringFilter();
  public variationGroupingId?: IdFilter = new IdFilter();
}

import { Model } from 'core/models';
import { Moment } from 'moment';
import { AppUser } from './AppUser';
import { RequestState } from './RequestState';
import { Status } from './Status';
import { ERouteContent } from './ERouteContent';
import { ERouteType } from './ERouteType';

export class ERoute extends Model
{
    public id?: number;

    public code?: string;

    public name?: string;

    public saleEmployeeId?: number;

    public startDate?: Moment;

    public endDate?: Moment;

    public requestStateId?: number;

    public statusId?: number = 1;

    public creatorId?: number;

    public creator?: AppUser;

    public requestState?: RequestState;

    public saleEmployee?: AppUser;

    public status?: Status;

    public eRouteContents?: ERouteContent[];

    public eRouteType?: ERouteType;

    public eRouteTypeId?: number;

}

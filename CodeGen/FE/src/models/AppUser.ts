import { Model } from 'core/models';
import { Moment } from 'moment';
import { AppUserRoleMapping } from './AppUserRoleMapping';
import { Status } from './Status';
import { Organization } from './Organization';
import { Sex } from './Sex';
import { Province } from './Province';

export class AppUser extends Model {
  public id?: number;
  public username?: string;
  public password?: string;
  public displayName?: string;
  public email?: string;
  public phone?: string;
  public userStatusId?: number;
  public createdAt?: Moment;
  public updatedAt?: Moment;
  public deletedAt?: Moment;
  public statusId?: number = 1;
  public status?: Status;
  public appUserRoleMappings?: AppUserRoleMapping[];
  public address?: string;
  public sexId?: number;
  public sex?: Sex;
  public position?: string;
  public department?: string;
  public organization?: Organization;
  public organizattionId?: number;
  public provinceId?: number;
  public province?: Province;

}

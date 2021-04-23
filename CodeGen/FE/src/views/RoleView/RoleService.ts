import { generalLanguageKeys } from 'config/consts';
import path from 'path';
import React from 'react';
import { useHistory } from 'react-router';
import nameof from 'ts-nameof.macro';

export class RoleService {
  public useRoleMasterNavigation(
    baseRoute: string,
  ): [() => void, (id: number) => () => void, (id: number) => () => void] {
    const history = useHistory();

    const handleGoCreate = React.useCallback(() => {
      history.push(
        path.join(baseRoute, nameof(generalLanguageKeys.actions.create)),
      );
    }, [baseRoute, history]);

    const handleGoAppUserRole = React.useCallback(
      (roleId: number) => {
        return () => {
          history.push(path.join(baseRoute, `assign-app-user/${roleId}`));
        };
      },
      [baseRoute, history],
    );

    const handleGoPermissionRole = React.useCallback(
      (roleId: number) => {
        return () => {
          history.push(path.join(baseRoute, `permission-role/${roleId}`));
        };
      },
      [baseRoute, history],
    );

    return [handleGoCreate, handleGoAppUserRole, handleGoPermissionRole];
  }
}

export const roleService: RoleService = new RoleService();

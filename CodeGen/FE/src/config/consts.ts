import { ColumnWidths, LanguageKeys } from 'react3l';
import { translate } from 'core/helpers/internationalization';

export const generalColumnWidths: ColumnWidths = {
  index: 50,
  checkbox: 50,
  expand: 50,
  actions: 120,
  default: 200,
};

export const generalLanguageKeys: LanguageKeys = {
  actions: {
    label: translate('general.actions.label'),
    create: translate('general.actions.create'),
    close: translate('general.actions.close'),
    add: translate('general.actions.add'),
    update: translate('general.actions.update'),
    delete: translate('general.actions.delete'),
    search: translate('general.actions.search'),
    filter: translate('general.actions.filter'),
    import: translate('general.actions.import'),
    export: translate('general.actions.export'),
    exportTemplate: translate('general.actions.exportTemplate'),
    reset: translate('general.actions.reset'),
    save: translate('general.actions.save'),
    cancel: translate('general.actions.cancel'),
    approve: translate('general.actions.approve'),
    sendApprove: translate('general.actions.sendApprove'),
    reject: translate('general.actions.reject'),
  },
  columns: {
    index: translate('general.columns.index'),
  },
  delete: {
    title: translate('general.delete.title'),
    content: translate('general.delete.content'),
  },
  batchDelete: {
    title: translate('general.batchDelete.title'),
    content: translate('general.batchDelete.content'),
  },
  update: {
    success: translate('general.update.success'),
    error: translate('general.update.error'),
  },
  state: {
    new: translate('general.state.new'),
    pending: translate('general.state.pending'),
    approved: translate('general.state.approved'),
    rejected: translate('general.state.rejected'),
  },
};

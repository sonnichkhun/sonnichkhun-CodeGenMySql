import React from 'react';
import { ERoute } from 'models/ERoute';
import { useTranslation } from 'react-i18next';
import MasterPreview from 'components/MasterPreview/MasterPreview';
import { Spin, Descriptions, Tooltip } from 'antd';
import { formatDate } from 'core/helpers/date-time';
import { limitWord } from 'core/helpers/string';
import { ERouteContent } from 'models/ERouteContent';

export interface PreviewERouteProps {
    previewModel : ERoute;
    previewVisible: boolean;
    onClose: () => void;
    previewLoading: boolean;
}


export default function PreviewERoute(props: PreviewERouteProps ) {
    const [translate] = useTranslation();
    const {previewModel, previewVisible, onClose, previewLoading} = props;

    const renderItems = React.useMemo(() => {
        const contentList  = [];
        if (previewModel) {
          if (previewModel.eRouteContents) {
            if (
              previewModel.eRouteContents.length > 0
            )
            previewModel.eRouteContents.forEach(
                (content: ERouteContent) => {
                  if (content.store) {
                    const { store } = content;
                    const value = `${store.name}`;
                    contentList.push(value);
                  }
                },
              );
          }
        }
        return contentList.join(',');
      }, [previewModel]);
    return (
        <MasterPreview
          isOpen={previewVisible}
          onClose={onClose}
          size="xl"
          title={previewModel.name}
          statusId={previewModel.statusId}
          code={previewModel.code}
        >
          <Spin spinning={previewLoading}>
            <Descriptions column={4}>
              <Descriptions.Item label={translate('eRoutes.saleEmployee')}>
                { previewModel?.saleEmployee?.displayName }
              </Descriptions.Item>

              <Descriptions.Item label={translate('eRoutes.startDate')}>
                { formatDate(previewModel?.startDate) }
              </Descriptions.Item>

              <Descriptions.Item label={translate('eRoutes.endDate')}>
                { formatDate(previewModel?.endDate) }
              </Descriptions.Item>

              <Descriptions.Item label={translate('eRoutes.eRouteType')}>
                {previewModel?.eRouteType?.name}
              </Descriptions.Item>

              <Descriptions.Item label={translate('eRoutes.requestState')}>
                {previewModel?.requestState?.name}
              </Descriptions.Item>

              <Descriptions.Item label={translate('eRoutes.store')}>
                <Tooltip title={renderItems} placement ="bottom">
                  {limitWord(renderItems , 20)}
                </Tooltip>
              </Descriptions.Item>

              </Descriptions>
          </Spin>
        </MasterPreview>
    );
}

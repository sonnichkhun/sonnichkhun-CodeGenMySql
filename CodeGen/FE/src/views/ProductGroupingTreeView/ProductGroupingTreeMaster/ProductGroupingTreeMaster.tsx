import { Card, Row, Col } from 'antd';
import Table, { ColumnProps } from 'antd/lib/table';
import ProductGroupingTree from 'components/ProductGroupingTree/ProductGroupingTree';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import { crudService } from 'core/services';
import { renderMasterIndex } from 'helpers/ant-design/table';
import { Product } from 'models/Product';
import { ProductFilter } from 'models/ProductFilter';
import { ProductGrouping } from 'models/ProductGrouping';
import { ProductGroupingFilter } from 'models/ProductGroupingFilter';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { tableService } from 'services';
import nameof from 'ts-nameof.macro';
import { productGroupingRepository } from 'views/ProductGroupingTreeView/ProductGroupingRepository';
import ProductGroupingTreeDetail from '../ProductGroupingTreeDetail/ProductGroupingTreeDetail';
import ProductProductGroupingModal from '../ProductGroupingTreeDetail/ProductProductGroupingMappingModal/ProductProductGroupingMappingModal';
import './ProductGroupingTreeMaster.scss';
import { Supplier } from 'models/Supplier';

function ProductGroupingTreeMaster() {
  const [translate] = useTranslation();
  /*  Hooks for crud tree */
  const [
    list,
    setList,
    loading,
    setLoading,
    ,
    previewVisible,
    ,
    handleOpenPreview,
    handleClosePreview,
    ,
    handleSearch,
    isDetail,
    ,
    visible,
    setVisible,
    currentItem,
    setCurrentItem,
    handleAddProductGrouping,
    handleAdd,
    handleEdit,
    handlePopupCancel,
    setLoadList,
  ] = crudService.useTreeMaster<ProductGrouping, ProductGroupingFilter>(
    ProductGrouping,
    ProductGroupingFilter,
    productGroupingRepository.list,
    productGroupingRepository.get,
  );

  /* HandleDelete hooks for tree item */
  const [handleDelete] = tableService.useDeleteHandler<ProductGrouping>(
    productGroupingRepository.delete,
    setLoading,
    list,
    setList,
    handleSearch,
  );

  /* HandleGetListMapping and HandleMappingBack */
  const [
    listProduct,
    setListProduct,
    handleGetListProduct,
    handleMappingProduct,
    total,
  ] = crudService.useMappingContent<ProductGrouping, Product>(
    productGroupingRepository.get,
    'productProductGroupingMappings',
    'product',
    'productGroupingId',
    'productId',
    'product',
  );

  // const [totalProductProductMappings, setTotalProductProductMappings] = React.useState<number>(0);


  const handleActive = React.useCallback(
    (node: ProductGrouping) => {
      setCurrentItem(node);
      handleGetListProduct(node?.id);
    },
    [setCurrentItem, handleGetListProduct],
  );

  /* Hooks for modal functionalities, including open mappings modal, close modal, selectedItems, list, total, save mappings */
  const [
    loadingProduct,
    visibleProduct,
    setVisibleProduct,
    listProduct2,
    totalProduct,
    handleOpenProduct,
    ,
    filterProduct,
    setFilterProduct,
  ] = crudService.useContentModal(
    productGroupingRepository.listProduct,
    productGroupingRepository.countProduct,
    ProductFilter,
  );


  const handleCloseProduct = React.useCallback(
    (currentItems: ProductGrouping) => {
      handleGetListProduct(currentItems?.id);
      setVisibleProduct(false);
    },
    [handleGetListProduct, setVisibleProduct],
  );

  const handleSaveProductModal = React.useCallback(
    (event, currentItems) => {
      const productProductGroupingMappings = handleMappingProduct(
        event,
        currentItems,
      );
      currentItems.productProductGroupingMappings = productProductGroupingMappings;
      productGroupingRepository
        .update(currentItems)
        .then(res => {
          if (res) {
            setVisibleProduct(false);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [handleMappingProduct, setLoading, setVisibleProduct],
  );

  /* Hooks for local treeMappingTable functionalities */
  const [
    dataSource,
    pagination,
    handleTableChange,
    handleDeleteProduct,
  ] = tableService.useLocalMappingTreeTable(
    listProduct,
    setListProduct,
    filterProduct,
    setFilterProduct,
    'productProductGroupingMappings',
    handleMappingProduct,
    productGroupingRepository.update,
    setVisibleProduct,
  );

  const columns: ColumnProps<Product>[] = React.useMemo(() => {
    return [
      {
        title: translate(generalLanguageKeys.columns.index),
        key: nameof(generalLanguageKeys.index),
        width: generalColumnWidths.index,
        render: renderMasterIndex<Product>(pagination),
      },

      {
        title: translate('productGrouping.master.product.id'),
        key: nameof(dataSource[0].id),
        width: 100,
        dataIndex: nameof(dataSource[0].id),
      },

      {
        title: translate('productGrouping.master.product.code'),
        key: nameof(dataSource[0].code),
        dataIndex: nameof(dataSource[0].code),
      },

      {
        title: translate('productGrouping.master.product.name'),
        key: nameof(dataSource[0].name),
        dataIndex: nameof(dataSource[0].name),
        ellipsis: true,
      },

      {
        title: translate('productGrouping.master.product.supplier'),
        key: nameof(dataSource[0].supplier),
        dataIndex: nameof(dataSource[0].supplier),
        render(supplier: Supplier) {
          return supplier?.name;
        },
      },
      {
        title: translate(generalLanguageKeys.actions.label),
        key: nameof(generalLanguageKeys.columns.actions),
        dataIndex: nameof(dataSource[0].id),
        width: generalColumnWidths.actions,
        align: 'center',
        render(product: Product) {
          return (
            <div className="d-flex justify-content-center">
              {currentItem && currentItem?.children?.length === 0 && (
                <button
                  className="btn btn-sm btn-link text-danger"
                  onClick={() => handleDeleteProduct(product, currentItem)}
                >
                  <i className="fa fa-trash" />
                </button>
              )}
              {currentItem && currentItem?.children?.length !== 0 && (
                <button className="btn btn-sm btn-link text-danger" disabled>
                  <i className="fa fa-trash" />
                </button>
              )}
            </div>
          );
        },
      },
    ];
  }, [currentItem, dataSource, handleDeleteProduct, pagination, translate]);


  return (
    <Card
      className="page master-page product-grouping-master"
      title={translate('productGroupings.master.title')}
    >
      <Row>
        <Col lg={12}>
          <div className="product-grouping">
            <div className="mb-3">
              <span className="title-product">
                {translate('productGroupings.master.grouping.title')}
              </span>
              <i
                role="button"
                className="icon fa fa-plus text-danger ml-2"
                onClick={handleAddProductGrouping}
              />
            </div>
            <ProductGroupingTree
              key={list[0]?.id}
              tree={list}
              onAdd={handleAdd}
              onEdit={handleEdit}
              onPreview={handleOpenPreview}
              onDelete={handleDelete}
              onActive={handleActive}
              currentItem={currentItem}
            />
          </div>
        </Col>
        <Col lg={12}>
          {currentItem &&
            currentItem?.id &&
            currentItem?.children.length === 0 && (
              <div>
                <button
                  className="btn btn-sm btn-primary mt-3 ml-1 mr-2"
                  onClick={handleOpenProduct}
                >
                  <i className="icon fa fa-plus mr-1" />
                  {translate('productGroupings.master.add')}
                </button>
                {/* <label
                  className="btn btn-sm btn-outline-primary mt-3 mr-2 mb-0"
                  htmlFor="master-import"
                >
                  <i className="fa mr-2 fa-upload" />
                  {translate(generalLanguageKeys.actions.import)}
                </label>
                <button className="btn btn-sm btn-outline-primary mt-3 mr-2">
                  <i className="fa mr-2 fa-download" />
                  {translate(generalLanguageKeys.actions.export)}
                </button> */}
              </div>
            )}

          <div className="table-product">
            <div className="mb-3 title-product">
              {translate('productGroupings.master.product.title')}
            </div>
            <Table
              key={listProduct[0]?.id}
              dataSource={listProduct}
              columns={columns}
              bordered
              size="small"
              tableLayout="fixed"
              loading={loading}
              rowKey={nameof(dataSource[0].key)}
              pagination={pagination}
              onChange={handleTableChange}
              title={() => (
                <>
                  <div className="d-flex justify-content-end">
                    <div className="flex-shrink-1 d-flex align-items-center">
                      {translate('general.master.pagination', {
                        pageSize: pagination.pageSize,
                        total,
                      })}
                    </div>
                  </div>
                </>
              )}
            />
          </div>

          <ProductProductGroupingModal
            title={translate('productGroupings.master.product.title')}
            selectedList={listProduct}
            initSelectedList={listProduct}
            setSelectedList={setListProduct}
            list={listProduct2}
            total={totalProduct}
            isOpen={visibleProduct}
            loading={loadingProduct}
            onClose={handleCloseProduct}
            onSave={handleSaveProductModal}
            currentItem={currentItem}
            isSave={true}
            pagination={pagination}
            dataSource={dataSource}
            getList={productGroupingRepository.listProduct}
            count={productGroupingRepository.countProduct}
          />
        </Col>
      </Row>
      {visible === true && (
        <ProductGroupingTreeDetail
          isDetail={isDetail}
          visible={visible}
          setVisible={setVisible}
          getListGroup={productGroupingRepository.list}
          setListGroup={setList}
          currentItem={currentItem}
          onClose={handlePopupCancel}
          setLoadList={setLoadList}
        />
      )}
      {previewVisible === true && (
        <ProductGroupingTreeDetail
          isDetail={isDetail}
          visible={previewVisible}
          isPreview={true}
          setVisible={setVisible}
          getListGroup={productGroupingRepository.list}
          setListGroup={setList}
          currentItem={currentItem}
          onClose={handleClosePreview}
        />
      )}
    </Card>
  );
}

export default ProductGroupingTreeMaster;

import React, { Dispatch, SetStateAction } from 'react';
import { StoreFilter } from 'models/StoreFilter';
import { Store } from 'models/Store';
import { ItemFilter } from 'models/ItemFilter';
import { Item } from 'models/Item';
import { IndirectSalesOrderFilter } from 'models/IndirectSalesOrderFilter';
import { IndirectSalesOrder } from 'models/IndirectSalesOrder';

export class IndirectSalesOrderService {
  public useStoreContentMaster(
    getList: (filter: StoreFilter) => Promise<Store[]>,
    count: (filter: StoreFilter) => Promise<number>,
    // currentItem: StoreGrouping,
  ): [
      StoreFilter,
      Dispatch<SetStateAction<StoreFilter>>,
      Store[],
      Dispatch<SetStateAction<Store[]>>,
      boolean,
      Dispatch<SetStateAction<boolean>>,
      () => void,
      number,
    ] {
    const [filter, setFilter] = React.useState<StoreFilter>(
      new StoreFilter(),
    );
    const [loading, setLoading] = React.useState<boolean>(true);
    const [loadList, setLoadList] = React.useState<boolean>(true);
    const [list, setList] = React.useState<Store[]>([]);
    const [total, setTotal] = React.useState<number>(0);

    React.useEffect(() => {
      if (loadList) {
        setLoading(true);
        Promise.all([getList(filter), count(filter)])
          .then(([list, total]) => {
            setList(list);
            setTotal(total);
          })
          .finally(() => {
            setLoadList(false);
            setLoading(false);
          });
      }
    }, [count, filter, getList, loadList]);

    const handleSearch = React.useCallback(() => {
      setLoadList(true);
    }, [setLoadList]);

    return [filter, setFilter, list, setList, loading, setLoading, handleSearch, total];
  }

  public useItemContentMaster(
    getList: (filter: ItemFilter) => Promise<Item[]>,
    count: (filter: ItemFilter) => Promise<number>,
  ): [
      ItemFilter,
      Dispatch<SetStateAction<ItemFilter>>,
      Item[],
      Dispatch<SetStateAction<Item[]>>,
      boolean,
      Dispatch<SetStateAction<boolean>>,
      () => void,
      number,
    ] {
    const [filter, setFilter] = React.useState<ItemFilter>(
      new ItemFilter(),
    );
    const [loading, setLoading] = React.useState<boolean>(true);
    const [loadList, setLoadList] = React.useState<boolean>(true);
    const [list, setList] = React.useState<Item[]>([]);
    const [total, setTotal] = React.useState<number>(0);

    React.useEffect(() => {
      if (loadList) {
        setLoading(true);
        Promise.all([getList(filter), count(filter)])
          .then(([list, total]) => {
            setList(list);
            setTotal(total);
          })
          .finally(() => {
            setLoadList(false);
            setLoading(false);
          });
      }
    }, [count, filter, getList, loadList]);

    const handleSearch = React.useCallback(() => {
      setLoadList(true);
    }, [setLoadList]);

    return [filter, setFilter, list, setList, loading, setLoading, handleSearch, total];
  }

  public useItemModal(
    getList: (filter: IndirectSalesOrderFilter) => Promise<IndirectSalesOrder[]>,
    count: (filter: IndirectSalesOrderFilter) => Promise<number>,
    model: IndirectSalesOrder,
  ): [
    boolean,
    boolean,
    Dispatch<SetStateAction<boolean>>,
    IndirectSalesOrder[],
    number,
  ]{
    const [visible, setVisible] = React.useState<boolean>(false);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [list, setList] = React.useState<IndirectSalesOrder[]>([]);
    const [total, setTotal] = React.useState<number>(0);
    const [filter] = React.useState<IndirectSalesOrderFilter>(new IndirectSalesOrderFilter());

    React.useEffect(() => {
      if (visible) {
        setLoading(true);
        if(model){
          // set default buyer store for item
          filter.buyerStoreId.equal = model.buyerStoreId;
        }
        Promise.all([getList(filter), count(filter)])
        .then(([list, total]) => {
          setList(list);
          setTotal(total);
        })
        .finally(() => {
          setLoading(false);
        });
      }
    }, [count, filter, getList, model, visible]);

    return [
      loading,
      visible,
      setVisible,
      list,
      total,
    ];
  }
}

export const indirectSalesOrderService: IndirectSalesOrderService = new IndirectSalesOrderService();

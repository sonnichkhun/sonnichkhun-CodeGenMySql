import { Item } from 'models/Item';
import { Product } from 'models/Product';
import { Variation } from 'models/Variation';
import { VariationGrouping } from 'models/VariationGrouping';
import React, { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from 'antd';
import { generalLanguageKeys } from 'config/consts';

export class ProductService {
  permutations(choices, callback, prefix = []) {
    if (!choices.length) {
      return callback(prefix);
    }
    // tslint:disable-next-line:prefer-for-of
    for (let c = 0; c < choices[0].variations.length; c++) {
      this.permutations(
        choices.slice(1),
        callback,
        prefix.concat(choices[0].variations[c]),
      );
    }
  }

  usePrice(
    product: Product,
    setProduct: Dispatch<SetStateAction<Product>>,
  ): [
    number,
    Dispatch<SetStateAction<number>>,
    number,
    Dispatch<SetStateAction<number>>,
    () => void,
    boolean,
    (index: number) => (value?: string) => void,
    (index: number) => () => void,
  ] {
    const [retailPrice, setRetailPrice] = React.useState<number>(0);
    const [salePrice, setSalePrice] = React.useState<number>(0);
    const addable: boolean =
      typeof product.variationGroupings === 'object'
        ? !(product.variationGroupings?.length >= 4)
        : true;

    const handleAddVariation = React.useCallback(() => {
      if (addable) {
        setProduct(
          Product.clone<Product>({
            ...product,
            variationGroupings: [
              ...(product.variationGroupings ?? []),
              new VariationGrouping(),
            ],
          }),
        );
      }
    }, [addable, product, setProduct]);

    const handleChangeVariationGroupingName = React.useCallback(
      (index: number) => {
        return (value?: string) => {
          product.variationGroupings[index].name = value;
          setProduct(
            Product.clone<Product>({
              ...product,
            }),
          );
        };
      },
      [product, setProduct],
    );

    const handleRemoveVariationGrouping = React.useCallback(
      (index: number) => {
        return () => {
          product.variationGroupings?.splice(index, 1);
          setProduct(
            Product.clone<Product>({
              ...product,
            }),
          );
        };
      },
      [product, setProduct],
    );

    return [
      retailPrice,
      setRetailPrice,
      salePrice,
      setSalePrice,
      handleAddVariation,
      addable,
      handleChangeVariationGroupingName,
      handleRemoveVariationGrouping,
    ];
  }

  useVariationGrouping(
    product: Product,
    setProduct: Dispatch<SetStateAction<Product>>,
    onSave: (product: Product) => Promise<Product>,
    items: Item[],
    setItems: Dispatch<SetStateAction<Item[]>>,
    price: number,
    retailPrice: number,
    setLoading: Dispatch<SetStateAction<boolean>>,
    onCancel?: () => void,
  ): [
    boolean,
    Variation,
    VariationGrouping,
    (index: number) => () => void,
    () => void,
    () => void,
    (field: string) => (value?: string) => void,
    (index: number) => string[],
    () => void,
    (groupIndex: number) => (itemIndex: number) => void,
    (index: number) => () => void,
    (index: number) => () => void,
  ] {
    const [translate] = useTranslation();
    const [visible, setVisible] = React.useState<boolean>(false);
    const [
      currentVariationGrouping,
      setCurrentVariationGrouping,
    ] = React.useState<VariationGrouping>(null);
    const [currentVariation, setCurrentVariation] = React.useState<Variation>(
      null,
    );
    const [currentIndex, setCurrentIndex] = React.useState<number>(-1);
    const [saveProduct, setSaveProduct] = React.useState<boolean>(false);

    React.useEffect(() => {
      if (saveProduct) {
        setLoading(true);
        // setSaveProduct(false);
        onSave(product)
          .then(() => {
            setProduct({ ...product });
          })
          .finally(() => {
            setLoading(false);
            setSaveProduct(false);
          });
      }
    }, [onSave, product, saveProduct, setLoading, setProduct]);

    const handleOpenModal = React.useCallback(
      (index: number) => {
        return () => {
          setCurrentIndex(index);
          const currentVariation: Variation = new Variation();
          setCurrentVariation(currentVariation);
          setCurrentVariationGrouping(product.variationGroupings[index]);
          setVisible(true);
        };
      },
      [product.variationGroupings],
    );
    const handleChangeCurrentVariation = React.useCallback(
      (field: string) => {
        return (value?: string) => {
          setCurrentVariation({
            ...currentVariation,
            [field]: value,
          });
        };
      },
      [currentVariation],
    );
    const handleUpdateVariationGrouping = React.useCallback(() => {
      const { variations = [] } = currentVariationGrouping;
      product.variationGroupings[currentIndex].variations = [
        ...variations,
        currentVariation,
      ];
      setProduct(
        Product.clone<Product>({
          ...product,
          variationGroupings: [...product.variationGroupings],
        }),
      );
      setVisible(false);
    }, [
      currentIndex,
      currentVariation,
      currentVariationGrouping,
      product,
      setProduct,
    ]);

    /* remove variation in variation list and its related items, save product */
    const handleRemoveVariation = React.useCallback(
      (groupindex: number) => {
        return (itemIndex: number) => {
          Modal.confirm({
            title: translate(generalLanguageKeys.delete.title),
            content: translate(generalLanguageKeys.delete.content),
            onCancel,
            okType: 'danger',
            onOk() {
              // remove variation from indexed list
              const variationList =
                product.variationGroupings[groupindex].variations;
              const removedVariation = variationList[itemIndex];
              variationList.splice(itemIndex, 1);
              product.variationGroupings[groupindex].variations = variationList;
              // remove items of deleted variation
              const newItems = items.filter(
                (item: Item) =>
                  !item.name.trim().includes(removedVariation.name.trim()),
              );
              setProduct(
                Product.clone<Product>({
                  ...product,
                  variationGroupings: [...product.variationGroupings],
                  items: [...newItems],
                }),
              );
              // save item to database
              setSaveProduct(true);
            },
          });
        };
      },
      [items, onCancel, product, setProduct, translate],
    );

    const handleRemoveVariationGrouping = React.useCallback(
      (index: number) => {
        return () => {
          Modal.confirm({
            title: translate(generalLanguageKeys.delete.title),
            content: translate(generalLanguageKeys.delete.content),
            onCancel,
            okType: 'danger',
            onOk() {
              const removedGrouping = product.variationGroupings[index];
              // remove variationGrouping from indexed list
              product.variationGroupings?.splice(index, 1);
              if (removedGrouping) {
                const variations = removedGrouping.variations.map(v => v.name);
                // find items match
                if (items.length > 0) {
                  const newItems = items.filter((item: Item) => {
                    let match = true;
                    variations.forEach(v => {
                      if (v.trim().includes(item.name.trim())) {
                        match = false;
                      }
                    });
                    return match;
                  });
                  setItems(newItems);
                }
              }
              setProduct(
                Product.clone<Product>({
                  ...product,
                }),
              );
              // save item to database
              setSaveProduct(true);
            },
          });
        };
      },
      [items, onCancel, product, setItems, setProduct, translate],
    );

    const handleCloseModal = React.useCallback(() => {
      setCurrentVariationGrouping(null);
      setVisible(false);
    }, []);
    const getDisplayValue: (index: number) => string[] = React.useCallback(
      index => {
        return product.variationGroupings[index].variations
          ?.filter((v: Variation) => {
            return typeof v.name === 'string' && v.name !== '';
          })
          .map((v: Variation) => v.name);
      },
      [product.variationGroupings],
    );

    const handleCombineVariations = React.useCallback(() => {
      const { variationGroupings } = product;
      const result: { [key: string]: Item } = {};
      const currentItems: Item[] = product.items;
      const currentItemKeys: { [key: number]: Item } = {};
      currentItems?.forEach((item: Item) => {
        currentItemKeys[item.id] = item;
      });
      this.permutations(variationGroupings, prefix => {
        const key: string = prefix.map((v: Variation) => v.code).join('-');
        const newItem: Item = Item.clone<Item>({
          key,
          productId: product.id,
          product,
          name: `${product.name} - ${prefix
            .map((v: Variation) => v.name)
            .join(' - ')}`,
          code: `${product.code}-${prefix
            .map((v: Variation) => v.code)
            .join('-')}`,
          scanCode: product.scanCode,
          salePrice: price,
          retailPrice,
          images: [],
          canDelete: true,
        });
        result[key] = newItem;
        return newItem;
      });
      // add new Items to list
      const newItems = [...items, ...Object.values(result)];
      setProduct(
        Product.clone<Product>({
          ...product,
          items: newItems,
        }),
      );
      setSaveProduct(true);
    }, [items, price, product, retailPrice, setProduct]);

    const handleDeleteItem = React.useCallback(
      (index: number) => {
        return () => {
          Modal.confirm({
            title: translate(generalLanguageKeys.delete.title),
            content: translate(generalLanguageKeys.delete.content),
            onCancel,
            okType: 'danger',
            onOk() {
              setLoading(true);
              items.splice(index, 1);
              setItems([...items]);
              setSaveProduct(true);
            },
          });
        };
      },
      [items, onCancel, setItems, setLoading, translate],
    );

    return [
      visible,
      currentVariation,
      currentVariationGrouping,
      handleOpenModal,
      handleCloseModal,
      handleUpdateVariationGrouping,
      handleChangeCurrentVariation,
      getDisplayValue,
      handleCombineVariations,
      handleRemoveVariation,
      handleDeleteItem,
      handleRemoveVariationGrouping,
    ];
  }
}

export const productService: ProductService = new ProductService();

exports.userStoreProductSearchA = async ( req, reply ) =>
{
  try
  {
    const results = await userProductSearchListSchema.validateAsync( req.body );
    const [ storeDataArr ] = await models.sequelize.query(
      `SELECT store_name,id, ( 100 * acos(cos(radians(${ results.lat })) * cos(radians(store_lat)) * cos(radians( store_long ) - radians(${ results.long })) + sin(radians(${ results.lat })) * sin(radians(store_lat ))) ) AS distance FROM stores HAVING distance < 8200 ORDER BY distance LIMIT 0, 20; `
    );
    const storeArrData = [];
    const productArrData = [];
    const productColorArrData = [];
    const productSizeArrData = [];
    for ( const storeData of storeDataArr )
    {
      var storeRecord = await models.Store.findOne( {
        where: {
          id: storeData.id,
        },
      } );
      var storeTimigRecord = await models.StoreTiming.findOne( {
        where: {
          store_id: storeData.id,
        },
      } );

      var [ productDataArr ] = await models.sequelize.query(
        `SELECT * from  products where product_title="${ results.searchkey }" and store_id="${ storeData.id }"`
      );

      for ( const productArr of productDataArr )
      {
        var [ productColorArr ] = await models.sequelize.query(
          `SELECT t1.id,t2.attr_name from product_colors t1 join attributeValueMasters t2 on t1.color_id=t2.attr_value where t1.store_id=${ storeRecord.id } and t1.product_id=${ productArr.id } and t2.attr_id=1`
        );
        for ( const productColor of productColorArr )
        {
          //console.log(productColor.attr_name);
          productColorArrData.push( productColor.attr_name );
        }
        var [ productSizeArr ] = await models.sequelize.query(
          `SELECT t1.id,t2.attr_name from product_sizes t1 join attributeValueMasters t2 on t1.size_id=t2.attr_value where t1.store_id=${ storeRecord.id } and t1.product_id=${ productArr.id } and t2.attr_id=2`
        );
        for ( const productSize of productSizeArr )
        {
          //console.log(productColor.attr_name);
          productSizeArrData.push( productSize.attr_name );
        }
        var [ productGalleryArr ] = await models.sequelize.query(
          `SELECT product_img from productGalleries t1 where t1.store_id=${ storeRecord.id } and product_id=${ productArr.id }`
        );

        const productAll = {
          product: productArr,
          productColor: productColorArrData,
          productSizes: productSizeArrData,
          productGalleries: productGalleryArr,
        };
        productArrData.push( productAll );
      }

      const storeAll = {
        store: storeRecord,
        storeTiming: storeTimigRecord,
      };
      const StoreWithProduct = {
        store: {
          store: storeRecord,
          storeTiming: storeTimigRecord,
        },
        product: productArrData,
      };
      storeArrData.push( StoreWithProduct );
    }

    const data = {
      stores: storeArrData,
    };

    //let data = results;
    let message = "";
    let message_code = "UserController:userProductList-02";
    let message_action = "catched Error:";
    let api_token = "";
    return Api.setSuccessResponse( data, message, message_code, message_action );
  } catch ( err )
  {
    let data = "opps!";
    let message = err.message;
    let message_code = "UserController:userStoreProductSearch-02";
    let message_action = "catched Error:";
    let api_token = "";
    return Api.setErrorResponse(
      data,
      message,
      message_code,
      message_action,
      api_token
    );
  }
};
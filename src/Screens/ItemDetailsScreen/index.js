import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  StatusBar,
  Modal,
  ToastAndroid,
} from 'react-native';
import axios from 'axios';
import {setCartItem} from '../../store/actions';

import {
  CustomHeaderPrim,
  logoSmall,
  TabNavButton,
  CustomButton,
  CategoryList,
  Loader,
  CustomToaster,
} from '../../SharedComponents';

import {CommonStyles} from '../../SharedComponents/CustomStyles';
import {
  upDownArrowIcon,
  closeIcon,
  plusBlackIcon,
} from '../../SharedComponents/CommonIcons';

import {QuantityList} from './components';

import {BaseUrl, base64Auth} from '../../utils/constants';

import Styles from './Styles';
import AsyncStorage from '@react-native-community/async-storage';
import {FlatList} from 'react-native-gesture-handler';

class ItemDetailsScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isQuantityModal: false,
      selectedImageIndex: 0,
      isUploadedImages: false,
      isProductDesc: true,
      productDetails: null,
      imageSelectIndex: 0,
      isExpandImages: false,
      productImageList: [],
      productQty: 1,
      productId: '',
      image1: '',
      image2: '',
      isLoading: false,
      isCustomToaster: false,
      colorVariants: [],
      colorSelector: '',
    };
  }

  componentDidMount() {
    const {productId} = this.props.route.params;
    this.setState({productId}, () => {
      if (this.state.productId) {
        this.getProductDetails(this.state.productId);
        // this.getReleatedProducts(this.state.productId);
        this.fetchColorVariants();
      }
    });

    if (this.props.route.params && this.props.route.params.data) {
      this.setState({isUploadedImages: true});
    }
    this.getLocalData();
  }

  componentWillUnmount() {
    // console.log('unmountede');
  }

  componentDidUpdate(prevProps) {
    if (this.props.route.params !== prevProps.route.params) {
      if (this.props.route.params.data === 'fromPhotTakensection')
        this.setState({isUploadedImages: true});
      if (prevProps.route.params.productId) {
        this.getProductDetails(prevProps.route.paramsproductId);
      } else if (this.props.route.params.productId) {
        this.getProductDetails(this.props.route.params.productId);
      }
      this.getLocalData();
    }
  }

  getLocalData = async () => {
    try {
      const localData = await AsyncStorage.getItem('productSection1');
      const localData1 = await AsyncStorage.getItem('productSection2');
      let localDataJson = JSON.parse(localData);
      let localDataJson2 = JSON.parse(localData1);
      if (
        localDataJson &&
        localDataJson.uri &&
        localDataJson2 &&
        localDataJson.uri
      ) {
        this.setState({image1: localDataJson.uri, image2: localDataJson2.uri});
      }
    } catch (err) {
      console.log('Err to get local data', err);
    }
  };

  getProductDetails = (id) => {
    this.setState({isLoading: true}, () => {
      axios
        .get(BaseUrl + '/admin/api/2020-07/products/' + id + '.json', {
          headers: {
            Authorization: base64Auth,
          },
        })
        .then((res) => {
          //   console.log('res data product details =>', res.data);
          if (res.data.product) {
            this.setState(
              {productDetails: res.data.product, isLoading: false},
              () => {
                console.log(
                  'Res get Product Details in State',
                  this.state.productDetails,
                );
              },
            );
          }
        })
        .catch((err) => {
          this.setState({productDetails: null, isLoading: false});
          console.log('Err in get Product Details ', err);
        });
    });
  };

  getReleatedProducts = (collection_id) => {
    console.warn('kk');

    axios
      .get(
        BaseUrl +
          '/admin/api/2020-07/collections/' +
          collection_id +
          '/products.json',
        {
          headers: {
            Authorization: base64Auth,
          },
        },
      )
      .then((res) => {
        console.warn('related products', res);

        // console.log('res data product details =>', res.data);
        // if (res.data.product) {
        //   this.setState({productDetails: res.data.product}, () => {
        //     console.log(
        //       'Res get Product Details in State',
        //       this.state.productDetails,
        //     );
        //   });
        // }
      })
      .catch((err) => {
        console.log('Err in get Product Details ', err);
      });
  };

  handleQuantity = () => {
    this.setState({isQuantityModal: !this.state.isQuantityModal});
  };

  handleAddToCart = () => {
    const {productDetails, productQty} = this.state;
    // 'Added to cart!');
    this.setState({isCustomToaster: true});
    this.props.setCartItem({data: productDetails, count: productQty});
  };

  setLocalData = async () => {
    console.log('Set to Local ', this.state.productDetails);
    if (this.state.productDetails !== null) {
      try {
        await AsyncStorage.setItem(
          'cartItem',
          JSON.stringify(this.state.productDetails),
        );
      } catch (err) {
        console.log('Cart item set', err);
      }
    } else {
      ('cannot add to cart please select photos again');
    }
  };

  showToaster = (message) => {
    ToastAndroid.showWithGravityAndOffset(
      message,
      ToastAndroid.LONG,
      ToastAndroid.TOP,
      25,
      50,
    );
  };

  toggleProductDesc = () => {
    this.setState({isProductDesc: !this.state.isProductDesc});
  };

  handleRemoveTags = (data) => {
    const regex = /(<([^>]+)>)/gi;
    const result = data.replace(regex, '');
    return result;
  };

  fetchColorVariants = async () => {
    const {productId} = this.state;
    await axios
      .get(`${BaseUrl}/admin/api/2020-10/products/${productId}.json`, {
        headers: {
          Authorization: base64Auth,
        },
      })
      .then((resp) => {
        if (resp) {
          let mapedValue = resp.data.product.variants.map((item) =>
            item.option1.toLowerCase(),
          );
          this.setState({colorVariants: mapedValue});
        }
      })
      .catch((error) => {
        alert(error);
      });
  };
  render() {
    const {
      TTComDB28,
      TTComDB18,
      TTComM16,
      TTComM18,
      TTComM14,
      TTComL16,
      tabNavContainer,
    } = CommonStyles;

    const {
      isQuantityModal,
      isUploadedImages,
      isProductDesc,
      productDetails,
      imageSelectIndex,
      isExpandImages,
      productQty,
      isLoading,
      isCustomToaster,
      colorVariants,
      colorSelector,
    } = this.state;

    const {cartList} = this.props;
    const {
      imageListWrapper,
      imageStyleinList,
      imageListAdd,
      imageListAddButton,
    } = Styles;

    const compare_value =
      productDetails !== null &&
      productDetails.variants !== null &&
      productDetails.variants.map((item) => item.compare_at_price);

    console.warn(productDetails);

    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
        <StatusBar backgroundColor="#fff" barStyle="dark-content" />

        <View style={{flex: 1, zIndex: 4, backgroundColor: 'transparent'}}>
          <CustomHeaderPrim
            leftIcon={logoSmall}
            placeholder="What are you looking for?"
            searchBox
            handleSearchBox={() => console.log('search box')}
          />
          {/* <Text style={{color: 'silver'}}>helow</Text> */}
        </View>

        <View style={{flex: 9}}>
          {isLoading ? (
            <Loader />
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
              {productDetails !== null && (
                <Image
                  source={{
                    uri:
                      productDetails !== null &&
                      productDetails.images[imageSelectIndex].src,
                  }}
                  style={{
                    width: '100%',
                    height: 400,
                    borderRadius: 27,
                    position: 'relative',
                    top: 50,
                    zIndex: 3,
                    resizeMode: 'contain',
                  }}
                />
              )}

              <View style={[imageListWrapper, {marginTop: 60}]}>
                {productDetails !== null && productDetails.images.length > 3 ? (
                  <>
                    {!isExpandImages &&
                      productDetails.images.slice(0, 3).map((item, index) => {
                        return (
                          <TouchableOpacity
                            key={index}
                            onPress={() =>
                              this.setState({imageSelectIndex: index})
                            }>
                            <Image
                              key={index}
                              source={{uri: item.src}}
                              style={imageStyleinList}
                            />
                          </TouchableOpacity>
                        );
                      })}
                    {!isExpandImages && (
                      <TouchableOpacity
                        onPress={() => this.setState({isExpandImages: true})}
                        style={[imageListAdd]}>
                        <View style={imageListAddButton}>
                          <Text
                            style={{
                              color: '#fff',
                              fontFamily: 'TTCommons-Medium',
                            }}>
                            {'+'}
                            {productDetails.images.length - 3}
                          </Text>
                        </View>
                        <Image
                          source={{
                            uri: productDetails.images[imageSelectIndex].src,
                          }}
                          style={[imageStyleinList, {marginHorizontal: 0}]}
                        />
                      </TouchableOpacity>
                    )}

                    {isExpandImages && (
                      <View
                        style={{
                          flexWrap: 'wrap',
                          width: '100%',
                          height: 'auto',
                          alignItems: 'center',
                        }}>
                        <ScrollView
                          horizontal={true}
                          showsHorizontalScrollIndicator={false}>
                          {productDetails.images
                            .slice(0, productDetails.images.length)
                            .map((item, index) => {
                              return (
                                <TouchableOpacity
                                  key={index}
                                  onPress={() =>
                                    this.setState({imageSelectIndex: index})
                                  }>
                                  <Image
                                    key={index}
                                    source={{uri: item.src}}
                                    style={imageStyleinList}
                                  />
                                </TouchableOpacity>
                              );
                            })}
                        </ScrollView>
                      </View>
                    )}
                  </>
                ) : (
                  productDetails !== null &&
                  productDetails &&
                  productDetails.images.length < 4 &&
                  productDetails.images.map((item, index) => {
                    return (
                      <TouchableOpacity
                        key={index}
                        onPress={() =>
                          this.setState({imageSelectIndex: index})
                        }>
                        <Image
                          key={index}
                          source={{uri: item.src}}
                          style={imageStyleinList}
                        />
                      </TouchableOpacity>
                    );
                  })
                )}
              </View>

              <View style={{flex: 1, paddingHorizontal: 20, paddingBottom: 70}}>
                <View style={{flexDirection: 'row'}}>
                  <View style={{width: '80%'}}>
                    <Text style={TTComDB18}>
                      {productDetails !== null && productDetails.title}
                    </Text>

                    {!colorVariants.includes('default title') && (
                      <FlatList
                        data={colorVariants}
                        horizontal={true}
                        keyExtractor={(index) => index.toString()}
                        renderItem={({item}) => {
                          return (
                            <TouchableOpacity
                              onPress={() =>
                                this.setState({colorSelector: item})
                              }
                              style={{
                                height: 20,
                                width: 20,
                                borderRadius: 15,
                                backgroundColor: item,
                                marginTop: 15,
                                marginBottom: 15,
                                borderColor: 'black',
                                borderWidth: colorSelector == item ? 2 : 0,
                                marginHorizontal: 15,
                              }}
                            />
                          );
                        }}
                      />
                    )}
                    <Text style={[TTComDB28, {color: '#FA3838'}]}>
                      {productDetails !== null &&
                        productDetails.variants[0].price + ' AED'}
                    </Text>

                    <Text
                      style={[
                        TTComM16,
                        {
                          textDecorationLine: 'line-through',
                          color: '#D1D1D1',
                        },
                      ]}>
                      {compare_value !== null ? compare_value[0] : ''}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => this.handleQuantity()}
                    style={{justifyContent: 'center'}}>
                    <View
                      style={{
                        backgroundColor: '#E9E9E9',
                        width: 70,
                        height: 50,
                        borderRadius: 15,
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        padding: 10,
                        alignSelf: 'flex-end',
                        // position: 'absolute',
                        // bottom: 20,
                      }}>
                      <Text style={[TTComM18, {paddingRight: 10}]}>
                        {productQty}
                      </Text>
                      <Image source={upDownArrowIcon} />
                    </View>
                  </TouchableOpacity>
                </View>

                {/* <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate('PhotoSectionScreen')
                  }
                  style={{
                    flexDirection: 'row',
                    paddingVertical: 20,
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      borderRadius: 100,
                      borderWidth: isUploadedImages ? 0 : 1,
                      padding: 10,
                    }}>
                    <Image
                      source={isUploadedImages ? uploadIconGrey : uploadIcon}
                    />
                  </View>
                  {isUploadedImages && image1 !== '' && image2 !== '' ? (
                    <View style={{flexDirection: 'row'}}>
                      <Image
                        source={{uri: image1}}
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 100,
                          zIndex: 3,
                          borderWidth: 5,
                          borderColor: '#fff',
                        }}
                      />
                      <Image
                        source={{uri: image2}}
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 100,
                          zIndex: 2,
                          position: 'relative',
                          left: -25,
                          borderWidth: 5,
                          borderColor: '#fff',
                        }}
                      />
                    </View>
                  ) : (
                    <Text style={[TTComM14, {paddingLeft: 15}]}>
                      Upload image
                    </Text>
                  )}
                </TouchableOpacity> */}

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginVertical: 10,
                  }}>
                  <CustomButton
                    buttonStyles="btn-primary"
                    textStyles="txt-primary"
                    text="Buy Now"
                    width="49%"
                    onAction={() =>
                      this.props.navigation.navigate('CheckoutNewUserScreen', {
                        data: productDetails,
                        productQty: productQty,
                      })
                    }
                  />
                  <CustomButton
                    buttonStyles="btn-secondary-black"
                    textStyles="txt-secondary"
                    text="Add to Cart"
                    width="49%"
                    onAction={() => this.handleAddToCart()}
                  />
                </View>

                <View style={{paddingVertical: 10}}>
                  <TouchableOpacity
                    onPress={() => this.toggleProductDesc()}
                    style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image source={plusBlackIcon} />
                    <Text style={[TTComDB28, {marginLeft: 10}]}>
                      Product specification
                    </Text>
                  </TouchableOpacity>
                  {isProductDesc &&
                    productDetails !== null &&
                    productDetails.body_html !== null &&
                    productDetails.body_html !== '' && (
                      <Text style={TTComL16}>
                        {this.handleRemoveTags(productDetails.body_html)}
                      </Text>
                    )}
                </View>

                <View style={{paddingVertical: 10}}>
                  <Text style={[TTComDB28, {marginBottom: 25}]}>
                    Related Products
                  </Text>
                  <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}>
                    <CategoryList
                      image={require('../../../assests/Test/b1a0e3f5f5cf5ca762b3d99e20a6fbb6.png')}
                      label="Coffee Mug"
                      price="16.75 AED"
                    />
                    <CategoryList
                      image={require('../../../assests/Test/b1a0e3f5f5cf5ca762b3d99e20a6fbb6.png')}
                      label="Coffee Mug"
                      price="16.75 AED"
                    />
                    <CategoryList
                      image={require('../../../assests/Test/b1a0e3f5f5cf5ca762b3d99e20a6fbb6.png')}
                      label="Coffee Mug"
                      price="16.75 AED"
                    />
                  </ScrollView>
                </View>
              </View>
            </ScrollView>
          )}
          <View style={[tabNavContainer, {width: '90%'}]}>
            <TabNavButton
              nav={this.props}
              active="2"
              cartNotification={cartList}
              {...this.props}
            />
          </View>
          {isCustomToaster && (
            <CustomToaster
              onend={() => this.setState({isCustomToaster: false})}
              position="center"
              isCustomToaster={isCustomToaster}
              message="Added to Cart!"
            />
          )}

          {isQuantityModal && (
            <Modal
              animationType="slide"
              transparent={true}
              visible={isQuantityModal}>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#292f332e',
                }}>
                <View
                  style={{
                    width: '50%',
                    backgroundColor: '#fff',
                    borderRadius: 15,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      padding: 10,
                    }}>
                    <Text style={[TTComDB18, {paddingVertical: 5}]}>
                      Select Quantity
                    </Text>
                    <TouchableOpacity
                      style={{paddingLeft: 10, padding: 10}}
                      onPress={() => this.setState({isQuantityModal: false})}>
                      <Image source={closeIcon} style={{tintColor: '#000'}} />
                    </TouchableOpacity>
                  </View>

                  <QuantityList
                    count={1}
                    isSelect={productQty === 1}
                    handleProductCount={(count) =>
                      this.setState({productQty: count, isQuantityModal: false})
                    }
                  />
                  <QuantityList
                    count={2}
                    isSelect={productQty === 2}
                    handleProductCount={(count) =>
                      this.setState({productQty: count, isQuantityModal: false})
                    }
                  />
                  <QuantityList
                    count={3}
                    isSelect={productQty === 3}
                    handleProductCount={(count) =>
                      this.setState({productQty: count, isQuantityModal: false})
                    }
                  />
                  <QuantityList
                    count={4}
                    isSelect={productQty === 4}
                    handleProductCount={(count) =>
                      this.setState({productQty: count, isQuantityModal: false})
                    }
                  />
                </View>
              </View>
            </Modal>
          )}
        </View>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state) => {
  console.log('PROP in REDUX', state.Layout.cartList);
  return {
    cartList: state.Layout.cartList,
  };
};
const mapDispatchToProps = {
  setCartItem,
};

export default connect(mapStateToProps, mapDispatchToProps)(ItemDetailsScreen);

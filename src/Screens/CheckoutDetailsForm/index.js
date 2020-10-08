import React, {Component} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ToastAndroid,
  Image,
  Platform,
} from 'react-native';

import axios from 'axios';
import {
  CustomHeaderPrim,
  CustomButton,
  CustomInput,
  Loader,
  CustomTracker,
} from '../../SharedComponents';

import {
  LeftArrowIcon,
  radioButton,
  radioButtonFill,
  greyCircleWithBlueIcon,
  greyCircleWithYellowIcon,
  greyCircleWithGreyIcon,
} from '../../SharedComponents/CommonIcons';

import {CommonStyles} from '../../SharedComponents/CustomStyles';

class CheckoutDetailsForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      options: {
        option1: false,
        option2: true,
      },
      showStates: false,
      showCountries: false,
      statesList: [
        {name: 'state 01', isSelected: false},
        {name: 'state 02', isSelected: false},
        {name: 'state 03', isSelected: false},
      ],
      selectedState: '',
      countriesList: [
        {name: 'Country 01', isSelected: false},
        {name: 'Country 02', isSelected: false},
        {name: 'Country 03', isSelected: false},
      ],
      selectedCountry: '',
    };
  }

  async componentDidMount() {}

  showToaster = (message) => {
    ToastAndroid.showWithGravityAndOffset(
      message,
      ToastAndroid.LONG,
      ToastAndroid.TOP,
      25,
      50,
    );
  };

  toggleOption = (type) => {
    console.log('OPtions clicked', type);
    let options = this.state.options;

    if (type === 'option1') {
      if (options.option1) {
        options.option1 = false;
        options.option2 = true;
      } else {
        options.option1 = true;
        options.option2 = false;
      }
    } else if (type === 'option2') {
      if (options.option2) {
        options.option2 = false;
        options.option1 = true;
      } else {
        options.option2 = true;
        options.option1 = false;
      }
    }
    this.setState({options});
  };

  toggleStatesList = () => this.setState({showStates: !this.state.showStates});

  toggleCountrieList = () =>
    this.setState({showCountries: !this.state.showCountries});

  handleChooseState = (index) => {
    let statesList = [...this.state.statesList];
    statesList[index].isSelected = true;
    statesList.forEach((item, indx) => {
      if (index !== indx) {
        item.isSelected = false;
      }
      return item;
    });

    this.setState({
      statesList,
      selectedState: statesList[index].name,
      showStates: false,
    });
  };

  handleChooseCountry = (index) => {
    let countriesList = [...this.state.countriesList];
    countriesList[index].isSelected = true;
    countriesList.forEach((item, indx) => {
      if (index !== indx) {
        item.isSelected = false;
      }
      return item;
    });

    this.setState({
      countriesList,
      selectedCountry: countriesList[index].name,
      showCountries: false,
    });
  };

  handleDropdownClose = () => {
    if (this.state.showCountries) {
      this.setState({showCountries: false});
    }
    if (this.state.showStates) {
      this.setState({showStates: false});
    }
  };

  render() {
    const {TTComM16, TTComDB16, TTComL16, TTComDB28} = CommonStyles;

    const {
      isLoading,
      options,
      showStates,
      statesList,
      selectedState,
      countriesList,
      selectedCountry,
      showCountries,
    } = this.state;

    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
        <StatusBar backgroundColor="#fff" barStyle="dark-content" />

        <View style={{flex: 1, zIndex: 4, backgroundColor: 'transparent'}}>
          <CustomHeaderPrim
            leftIcon={LeftArrowIcon}
            leftIconAction={() => this.props.navigation.goBack()}
            centerLabel="Checkout"
          />
        </View>

        {isLoading ? (
          <Loader />
        ) : (
          <TouchableOpacity
            onPress={() => this.handleDropdownClose()}
            activeOpacity={1}
            style={{flex: 9, paddingHorizontal: 20}}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={{marginTop: 100}} />

              <CustomTracker stage={1} />

              <View style={{marginVertical: 20}}>
                <CustomInput
                  placeholder="Name"
                  keyboardType="email-address"
                  // onchange={(data) => this.handleEmail(data)}
                  onFocus={() => this.handleDropdownClose()}
                />

                <View style={{marginVertical: 10}} />

                <CustomInput
                  placeholder="Address 1"
                  keyboardType="email-address"
                  // onchange={(data) => this.handleEmail(data)}
                  onFocus={() => this.handleDropdownClose()}
                />

                <View style={{marginVertical: 10}} />

                <CustomInput
                  placeholder="Address optional"
                  keyboardType="email-address"
                  // onchange={(data) => this.handleEmail(data)}
                  onFocus={() => this.handleDropdownClose()}
                />

                <View style={{marginVertical: 10}} />

                <CustomInputDropdown
                  value={selectedState}
                  placeholder="States"
                  onAction={() => this.toggleStatesList()}
                />

                {showStates && (
                  <View
                    style={{
                      maxHeight: 200,
                      borderColor: '#E9E9E9',
                      borderWidth: 1.5,
                      borderRadius: 12,
                    }}>
                    <ScrollView nestedScrollEnabled={true}>
                      {statesList &&
                        statesList.length &&
                        statesList.map((list, index) => {
                          return (
                            <TouchableOpacity
                              key={index}
                              onPress={() => this.handleChooseState(index)}
                              style={{
                                paddingVertical: 15,
                                flexDirection: 'row',
                                alignItems: 'center',
                              }}>
                              <View
                                style={
                                  list.isSelected
                                    ? {
                                        paddingVertical: 15,
                                        width: 5,
                                        backgroundColor: '#FFC000',
                                      }
                                    : {}
                                }
                              />
                              <Text
                                style={[
                                  list.isSelected ? TTComM16 : TTComL16,
                                  {paddingLeft: 15},
                                ]}>
                                {list.name}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                    </ScrollView>
                  </View>
                )}

                <View style={{marginVertical: 10}} />

                <CustomInputDropdown
                  value={selectedCountry}
                  placeholder="Country"
                  onAction={() => this.toggleCountrieList()}
                />

                {showCountries && (
                  <View
                    style={{
                      maxHeight: 200,
                      borderColor: '#E9E9E9',
                      borderWidth: 1.5,
                      borderRadius: 12,
                    }}>
                    <ScrollView nestedScrollEnabled={true}>
                      {countriesList &&
                        countriesList.length &&
                        countriesList.map((list, index) => {
                          return (
                            <TouchableOpacity
                              key={index}
                              onPress={() => this.handleChooseCountry(index)}
                              style={{
                                paddingVertical: 15,
                                flexDirection: 'row',
                                alignItems: 'center',
                              }}>
                              <View
                                style={
                                  list.isSelected
                                    ? {
                                        paddingVertical: 15,
                                        width: 5,
                                        backgroundColor: '#FFC000',
                                      }
                                    : {}
                                }
                              />
                              <Text
                                style={[
                                  list.isSelected ? TTComM16 : TTComL16,
                                  {paddingLeft: 15},
                                ]}>
                                {list.name}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                    </ScrollView>
                  </View>
                )}
              </View>

              <View
                style={{
                  borderWidth: 1.5,
                  borderColor: '#E9E9E9',
                  borderRadius: 12,
                  marginBottom: 30,
                  paddingVertical: 20,
                }}>
                <CustomSelector
                  option={options.option1}
                  text="Express shipping"
                  days="1-2 days"
                  price="(15AED)"
                  toggleOption={() => this.toggleOption('option1')}
                />

                <CustomSelector
                  option={options.option2}
                  text="Standard shipping"
                  days="3-5 days"
                  price="(FREE)"
                  toggleOption={() => this.toggleOption('option2')}
                />
              </View>

              <View style={{marginBottom: 30}}>
                <CustomButton
                  buttonStyles="btn-primary"
                  textStyles="txt-primary"
                  text="Next"
                  width="100%"
                  onAction={() =>
                    this.props.navigation.navigate('CheckoutPaymentScreen')
                  }
                />
              </View>
            </ScrollView>
          </TouchableOpacity>
        )}
      </SafeAreaView>
    );
  }
}

export default CheckoutDetailsForm;

const CustomSelector = (props) => {
  const {text, days, price, option, toggleOption} = props;
  const {TTComM16, TTComDB16} = CommonStyles;
  return (
    <TouchableOpacity
      onPress={() => toggleOption && toggleOption()}
      style={{flexDirection: 'row', marginVertical: 10, marginHorizontal: 20}}>
      <Image
        source={option ? radioButtonFill : radioButton}
        style={{marginRight: 15}}
      />
      <Text style={TTComM16}>{text && text}</Text>
      <Text style={[TTComDB16, {color: '#7E82E6', marginHorizontal: 5}]}>
        {days && days}
      </Text>
      <Text style={[TTComDB16, {color: '#7E82E6'}]}>{price && price}</Text>
    </TouchableOpacity>
  );
};

const CustomInputDropdown = (props) => {
  const {label, value, onAction, placeholder} = props;
  console.log('value', value);
  return (
    <View>
      {label && (
        <Text style={CommonStyles.customInputLabel}>{label && label}</Text>
      )}
      <TouchableOpacity onPress={() => onAction()} style={{}}>
        <View
          style={{
            borderRadius: 12,
            backgroundColor: '#fff',
            justifyContent: 'center',
            borderWidth: 1.5,
            borderColor: '#E9E9E9',
            paddingLeft: 20,
            height: 50,
          }}>
          <Text
            style={{
              color: placeholder ? '#8C8C8C' : '#000',
              fontSize: 16,
              fontFamily: 'TTCommons-Medium',
              textAlignVertical: 'center',
            }}>
            {value === '' && placeholder
              ? placeholder
              : value === ''
              ? 'Country'
              : value}
          </Text>
        </View>
        <Image
          source={require('../../../assests/RegisterScreen/dropdownDownIcon/Polygon2.png')}
          style={{position: 'absolute', top: '40%', right: 20}}
        />
      </TouchableOpacity>
    </View>
  );
};

import {
  Alert,
  KeyboardTypeOptions,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  Modal,
  Platform,
} from "react-native";
// Remove React Navigation imports
// import { StaticScreenProps } from "@react-navigation/native";
// Add Expo Router imports
import { useLocalSearchParams, useRouter } from "expo-router";
import IconRight from "@expo/vector-icons/FontAwesome";
import BankIcon from "@expo/vector-icons/FontAwesome";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { useState, useEffect } from "react";

import { hscale, mscale, wscale } from "../helpers/metric";
import PrimaryButton from "../components/primaryButton";
import { AUTH_API_CLIENT } from "../api/apiClient";
import { globalStyles } from "../styles/global";
import { colors } from "../constants/theme";
import { BANKS } from "../constants/data";
import ErrorModal from "../components/errorModal";

interface BankDetailForm {
  accountName: string;
  accountNumber: string;
  bankName: string;
  amount: string;
}

type FormFields = "accountName" | "accountNumber" | "bankName" | "amount";

export default function Cashout() {
  // Use Expo Router hooks
  const params = useLocalSearchParams();
  const router = useRouter();
  
  const [showModal, setShowModal] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [userBalance, setUserBalance] = useState<number | null>(null);
  const [bankDetailsForm, setBankDetailsForm] = useState<BankDetailForm>({
    accountName: "",
    accountNumber: "",
    bankName: "",
    amount: "",
  });
  const [submittingForm, setSubmittingForm] = useState(false);

  // Parse userBalance from URL params
  useEffect(() => {
    console.log('Platform:', Platform.OS);
    console.log('URL params:', params);
    if (params.balance) {
      console.log('Raw balance param:', params.balance);
      console.log('Type of balance param:', typeof params.balance);
      const balanceValue = parseFloat(params.balance as string);
      console.log('Parsed balance value:', balanceValue);
      console.log('Is NaN?', isNaN(balanceValue));
      setUserBalance(isNaN(balanceValue) ? null : balanceValue);
    } else {
      console.log('No balance param found');
    }
  }, [params.balance]);

  const handleSetForm = (value: string, formField: FormFields | undefined) => {
    if (formField === "accountName") {
      setBankDetailsForm((prev) => {
        return { ...prev, accountName: value };
      });
    }

    if (formField === "accountNumber") {
      setBankDetailsForm((prev) => {
        return { ...prev, accountNumber: value };
      });
    }

    if (formField === "bankName") {
      setBankDetailsForm((prev) => {
        return { ...prev, bankName: value };
      });
    }

    if (formField === "amount") {
      setBankDetailsForm((prev) => {
        return { ...prev, amount: value };
      });
    }
  };

  const handleSubmitForm = async () => {
    console.log('=== SUBMIT FORM STARTED ===');
    console.log('Platform:', Platform.OS);
    console.log('Submit button clicked!');
    
    const { accountName, accountNumber, amount, bankName } = bankDetailsForm;
    
    console.log('Form data:', { 
      accountName, 
      accountNumber, 
      amount, 
      bankName,
      accountNameLength: accountName.length,
      accountNumberLength: accountNumber.length,
      amountLength: amount.length,
      bankNameLength: bankName.length
    });
    console.log('User balance state:', userBalance);
    console.log('Type of userBalance:', typeof userBalance);
    
    // Fixed validation - removed duplicate accountName check
    if (
      !accountName.trim() ||
      !amount.trim() ||
      !accountNumber.trim() ||
      !bankName.trim()
    ) {
      console.log('Validation failed: Missing fields');
      console.log('accountName.trim():', accountName.trim().length > 0);
      console.log('amount.trim():', amount.trim().length > 0);
      console.log('accountNumber.trim():', accountNumber.trim().length > 0);
      console.log('bankName.trim():', bankName.trim().length > 0);
      Alert.alert("Error!", "Please fill all fields");
      return;
    }

    if (accountNumber.length !== 10) {
      console.log('Validation failed: Account number length invalid', accountNumber.length);
      Alert.alert("Error!", "Account number must be 10 digits.");
      return;
    }

    const amountNum = Number(amount.trim());
    console.log('Amount as number:', amountNum);
    console.log('Is amount a valid number?', !isNaN(amountNum));
    if (isNaN(amountNum)) {
      console.log('Validation failed: Amount is not a number');
      Alert.alert("Error!", "Please enter a valid amount");
      return;
    }

    if (amountNum <= 0) {
      console.log('Validation failed: Amount is zero or negative');
      Alert.alert("Error!", "Amount must be greater than zero");
      return;
    }

    // Check if userBalance is null or undefined
    console.log('Checking userBalance:', userBalance);
    console.log('userBalance === null:', userBalance === null);
    console.log('userBalance === undefined:', userBalance === undefined);
    console.log('typeof userBalance:', typeof userBalance);
    
    if (userBalance === null || userBalance === undefined) {
      console.log('Validation failed: User balance not available');
      Alert.alert("Error!", "Unable to retrieve your balance. Please try again.");
      return;
    }

    // Check if amount is greater than balance
    console.log('Comparing amountNum > userBalance:', amountNum, '>', userBalance, '=', amountNum > userBalance);
    if (amountNum > userBalance) {
      console.log('Validation failed: Insufficient balance', { 
        amountNum, 
        userBalance,
        difference: amountNum - userBalance
      });
      Alert.alert("Error!", `Balance too low for withdrawal amount. Your balance is NGN ${userBalance.toFixed(2)}`);
      return;
    }

    const requestForm = {
      accountName: accountName.trim(),
      accountNumber: accountNumber.trim(),
      bankName: bankName.trim(),
      amount: amountNum,
    };
    
    console.log('Sending request:', requestForm);
    
    try {
      setSubmittingForm(true);
      console.log('Making API call to /cashouts/create');
      const response = await AUTH_API_CLIENT.post(
        "/cashouts/create",
        requestForm
      );

      console.log('Response status:', response.status);
      console.log('Response data:', response.data);
      console.log('Response headers:', response.headers);

      if (response.status === 200) {
        console.log('Success! Showing modal');
        setShowModal(true);
      } else {
        console.log('Unexpected status code:', response.status);
      }
    } catch (error: any) {
      console.log('=== ERROR DETAILS ===');
      console.log('Error submitting cashout request:', error);
      console.log('Error name:', error.name);
      console.log('Error message:', error.message);
      console.log('Error stack:', error.stack);
      console.log('Error response status:', error.response?.status);
      console.log('Error response data:', error.response?.data);
      console.log('Error response headers:', error.response?.headers);
      
      let message = "Error, Something went wrong, try again later!";
      
      if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.message) {
        message = error.message;
      }
      
      console.log('Setting error message:', message);
      setErrorMessage(message);
      setErrorVisible(true);
    } finally {
      console.log('Setting submittingForm to false');
      setSubmittingForm(false);
    }
    
    console.log('=== SUBMIT FORM ENDED ===');
  };

  return (
    <View style={globalStyles.screen}>
      <EarningsBalanceView userBalance={userBalance} />
      <SuccessModal showModal={showModal} setShowModal={setShowModal} />
      <View>
        <Text
          style={{
            fontFamily: "Inter-Bold",
            color: colors.black,
            fontSize: mscale(20),
            marginTop: hscale(12),
          }}
        >
          Bank Details
        </Text>
        {/* form */}
        <View style={{ marginTop: hscale(20) }}>
          {/* account name */}
          <InputView
            placeholder="Enter Account name"
            setForm={(value) => {
              console.log('Account name changed:', value);
              handleSetForm(value, "accountName");
            }}
          />
          {/* account number */}
          <InputView
            placeholder="Account number"
            setForm={(value) => {
              console.log('Account number changed:', value);
              handleSetForm(value, "accountNumber");
            }}
            keyboardType="numeric"
          />
          {/* select bank */}
          <SelectBankInputView handleSetForm={handleSetForm} />
          {/* enter amount */}
          <InputView
            placeholder="Enter amount"
            setForm={(value) => {
              console.log('Amount changed:', value);
              handleSetForm(value, "amount");
            }}
            keyboardType="numeric"
          />
        </View>

        {/* submit button */}
        <PrimaryButton
          text="Submit"
          onPress={handleSubmitForm}
          isLoading={submittingForm}
        />
      </View>
      <ErrorModal
        visible={errorVisible}
        message={errorMessage}
        onClose={() => setErrorVisible(false)}
      />
    </View>
  );
}

const SuccessModal = ({
  showModal,
  setShowModal,
}: {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const router = useRouter();
  
  const handleOkPress = () => {
    console.log('Success modal OK pressed');
    setShowModal(false);
    // Navigate back to earnings screen
    router.back();
  };

  return (
    <Modal
      animationType="slide"
      visible={showModal}
      onRequestClose={() => {
        console.log('Success modal closed');
        setShowModal(false);
      }}
      transparent={true}
    >
      <View style={styles.successModalView}>
        <View style={styles.modal}>
          <Image
            source={require("../../assets/images/success.png")}
            style={{
              width: wscale(150),
              height: hscale(150),
              marginVertical: hscale(20),
            }}
          />
          <Text
            style={[globalStyles.headlineText, { marginBottom: hscale(8) }]}
          >
            Successfully Added
          </Text>
          <Text
            style={[
              globalStyles.bodyText,
              { fontSize: mscale(14), textAlign: "center" },
            ]}
          >
            Your application for withdrawal has been submitted, wait for 1-2
            business working days to receive funds in your account.
          </Text>
          <View style={{ flexDirection: "row", marginVertical: hscale(20) }}>
            <Image
              source={require("../../assets/images/bi_question.png")}
              style={{ height: hscale(40), aspectRatio: 1 }}
            />
            <Text style={{ width: "85%" }}>
              Delay not yet received? Send complaints to support.
            </Text>
          </View>

          <PrimaryButton text="Ok" onPress={handleOkPress} />
        </View>
      </View>
    </Modal>
  );
};

interface InputViewProps {
  editable?: boolean;
  value?: string;
  placeholder: string;
  setForm?: (value: string) => void;
  keyboardType?: KeyboardTypeOptions;
  iconsLeft?: boolean;
}

const InputView = ({
  editable = true,
  value,
  placeholder,
  setForm,
  keyboardType,
  iconsLeft = false,
}: InputViewProps) => {
  return (
    <View style={styles.textInputView}>
      <TextInput
        value={value}
        editable={editable}
        placeholder={placeholder}
        style={styles.textInput}
        cursorColor={colors.primary}
        onChangeText={(text) => {
          console.log(`${placeholder} changed:`, text);
          setForm && setForm(text);
        }}
        keyboardType={keyboardType ? keyboardType : "default"}
      />

      {iconsLeft && <IconRight name="angle-down" size={20} />}
    </View>
  );
};

const SelectBankInputView = ({
  handleSetForm,
}: {
  handleSetForm: (value: string, formField: FormFields | undefined) => void;
}) => {
  const [selectedBank, setSelectedBank] = useState<string>("");
  const [showDropDown, setShowDropDown] = useState(false);

  const handleSetSelectedBank = (bank: string) => {
    console.log('Bank selected:', bank);
    setSelectedBank(bank);
    handleSetForm(bank, "bankName");
    setShowDropDown(false);
  };

  return (
    <View style={{ position: "relative" }}>
      <Pressable onPress={() => {
        console.log('Bank dropdown pressed');
        setShowDropDown(true);
      }}>
        <InputView
          editable={false}
          value={selectedBank}
          placeholder="Select Bank"
          iconsLeft={true}
        />
      </Pressable>
      {/* dropdown view - select bank */}
      {showDropDown && (
        <View style={[{ height: hscale(300) }, styles.dropdownView]}>
          <FlashList
            estimatedItemSize={BANKS.length}
            showsVerticalScrollIndicator={false}
            data={BANKS}
            renderItem={({ item }) => {
              return (
                <Pressable
                  onPress={() => handleSetSelectedBank(item)}
                  style={{
                    flexDirection: "row",
                    paddingVertical: hscale(12),
                    alignItems: "center",
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    paddingHorizontal: wscale(20),
                    borderColor: colors.greyView,
                  }}
                >
                  <BankIcon name="bank" size={20} />
                  <Text style={styles.dropDownText}>{item}</Text>
                </Pressable>
              );
            }}
          />
        </View>
      )}
    </View>
  );
};

const EarningsBalanceView = ({
  userBalance,
}: {
  userBalance: number | null | any;
}) => {
  console.log('EarningsBalanceView rendered with balance:', userBalance);
  console.log('Type of userBalance in view:', typeof userBalance);
  
  return (
    <View style={styles.copyReferralCodeView}>
      <View style={{ flex: 1 }}>
        <Text
          style={[
            styles.text,
            { fontFamily: "Inter-Bold", color: colors.black },
          ]}
        >
          Earnings
        </Text>
        {userBalance != null ? (
          <Text
            style={[
              styles.text,
              {
                fontFamily: "Inter-Bold",
                fontSize: mscale(20),
              },
            ]}
          >
            {`NGN ${userBalance.toFixed(2)}`}
          </Text>
        ) : (
          <Text
            style={[
              styles.text,
              {
                fontFamily: "Inter-Regular",
                fontSize: mscale(14),
                color: colors.greyView,
              },
            ]}
          >
            Loading balance...
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  textButton: {
    fontFamily: "Inter-Bold",
    fontSize: mscale(12),
    height: hscale(32),
    backgroundColor: colors.primary,
    paddingHorizontal: wscale(20),
    textAlign: "center",
    lineHeight: hscale(32),
    color: "#ffffff",
    borderRadius: mscale(16),
  },
  copyReferralCodeView: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.inputFieldNew,
    paddingVertical: hscale(12),
    paddingHorizontal: wscale(24),
    borderRadius: mscale(12),
    marginTop: hscale(20),
    borderWidth: 1.5,
    borderColor: colors.black,
  },
  text: {
    fontFamily: "Inter-Regular",
    fontSize: mscale(16),
    color: "#5C5F62",
  },
  dropDownText: {
    fontFamily: "Inter-Medium",
    color: colors.black,
    paddingVertical: hscale(12),
    fontSize: mscale(14),
    flex: 1,
    marginLeft: wscale(12),
  },
  textInputView: {
    height: hscale(60),
    backgroundColor: colors.inputField,
    marginBottom: hscale(12),
    borderRadius: mscale(30),
    paddingHorizontal: wscale(20),
    flexDirection: "row",
    alignItems: "center",
  },
  textInput: {
    fontFamily: "Inter-Medium",
    fontSize: mscale(14),
    flex: 1,
  },
  dropdownView: {
    elevation: 5,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.7,
    shadowRadius: 2,
    backgroundColor: "#ffffff",
    borderRadius: mscale(8),
    position: "absolute",
    top: hscale(60),
    left: 0,
    right: 0,
    zIndex: 90,
  },
  successModalView: {
    flex: 1,
    position: "absolute",
    zIndex: 900,
    backgroundColor: "transparent",
    top: 0,
    bottom: 0,
    inset: 0,
    alignItems: "center",
  },
  modal: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingVertical: hscale(20),
    width: "85%",
    paddingHorizontal: wscale(20),
    elevation: 5,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.7,
    shadowRadius: 2,
    borderRadius: mscale(8),
    position: "relative",
    height: hscale(500),
    top: hscale(100),
  },
});
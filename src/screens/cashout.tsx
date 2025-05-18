import {
  Alert,
  KeyboardTypeOptions,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  Modal,
} from "react-native";
import { StaticScreenProps } from "@react-navigation/native";
import IconRight from "@expo/vector-icons/FontAwesome";
import BankIcon from "@expo/vector-icons/FontAwesome";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { useState } from "react";

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

export default function Cashout({
  route,
}: StaticScreenProps<{ userBalance: number | null }>) {
  const [showModal, setShowModal] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const userBalance = route.params.userBalance;
  const [bankDetailsForm, setBankDetailsForm] = useState<BankDetailForm>({
    accountName: "",
    accountNumber: "",
    bankName: "",
    amount: "",
  });
  const [submittingForm, setSubmittingForm] = useState(false);
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
    const { accountName, accountNumber, amount, bankName } = bankDetailsForm;
    if (
      !accountName.trim() ||
      !accountName.trim() ||
      !amount.trim() ||
      !accountNumber.trim() ||
      !bankName.trim()
    )
      return;

    if (accountNumber.length > 10 || accountNumber.length < 10) {
      Alert.alert("Error!", "Account number is invalid.");
      return;
    }

    if (
      Number(amount.trim()) > (userBalance ? userBalance : 0) ||
      Number(amount) === 0
    ) {
      Alert.alert("Error!", "Balance too low for withdraw amount");
      return;
    }

    const requestForm = {
      accountName: accountName.trim(),
      accountNumber: accountNumber.trim(),
      bankName: bankName.trim(),
      amount: Number(amount.trim()),
    };
    try {
      setSubmittingForm(true);
      const response = await AUTH_API_CLIENT.post(
        "/cashouts/create",
        requestForm
      );

      if (response.status === 200) {
        setShowModal(true);
      }
    } catch (error: any) {
      console.log("Submitting cashout requests", error);
      //   Alert.alert("Error!", "Something went wrong try again later.");
      let message = "Error, Something went wrong, try again later!";
      setErrorMessage(message);
      setErrorVisible(true);
    } finally {
      setSubmittingForm(false);
    }
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
            setForm={(value) => handleSetForm(value, "accountName")}
          />
          {/* account number */}
          <InputView
            placeholder="Account number"
            setForm={(value) => handleSetForm(value, "accountNumber")}
            keyboardType="numeric"
          />
          {/* select bank */}
          <SelectBankInputView handleSetForm={handleSetForm} />
          {/* enter amount */}
          <InputView
            placeholder="Enter amount"
            setForm={(value) => handleSetForm(value, "amount")}
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
  return (
    <Modal
      animationType="slide"
      visible={showModal}
      onRequestClose={() => setShowModal(false)}
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
            Your application for witdrawal has been submitted, wait for 1-2
            business working days to receive funds in your account.
          </Text>
          <View style={{ flexDirection: "row", marginVertical: hscale(20) }}>
            <Image
              source={require("../../assets/images/bi_question.png")}
              style={{ height: hscale(40), aspectRatio: 1 }}
            />
            <Text style={{ width: "85%" }}>
              Delay not yet recieved? Send complaints to support.
            </Text>
          </View>

          <PrimaryButton text="Ok" onPress={() => setShowModal(false)} />
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
        onChangeText={(text) => setForm && setForm(text)}
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
    setSelectedBank(bank);
    handleSetForm(bank, "bankName");
    setShowDropDown(false);
  };

  return (
    <View style={{ position: "relative" }}>
      <Pressable onPress={() => setShowDropDown(true)}>
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
        {userBalance != null && (
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
    backgroundColor: "#ECECEC",
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

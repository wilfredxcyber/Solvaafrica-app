import { createDrawerNavigator, } from '@react-navigation/drawer';
import Icon from '@expo/vector-icons/AntDesign';
import { StyleSheet } from 'react-native';

import CustomDrawer from '../components/customDrawer';
import { hscale, mscale } from '../helpers/metric';
import { Profile, Complaints } from '../screens';
import { colors } from '../constants/theme';


const SettingsDrawer = createDrawerNavigator({
    drawerContent: (props) => <CustomDrawer {...props} />,
    screens: { Profile, Complaints },
    screenOptions: ({ route }) => {
        return {
            drawerIcon: ({ color }) => {
                let iconName: 'user' | 'exclamationcircleo' | undefined;

                if (route.name === 'Profile') {
                    iconName = 'user'
                } else if (route.name === 'Complaints') {
                    iconName = 'exclamationcircleo'
                }

                if (iconName) return <Icon name={iconName} size={24} color={color} />
            },

            drawerActiveTintColor: colors.primary,
            drawerItemStyle: { marginBottom: hscale(12), borderBottomWidth: StyleSheet.hairlineWidth, borderColor: '#C9CFC9', },
            drawerActiveBackgroundColor: 'transparent',
            drawerStyle: { borderTopRightRadius: 0, overflow: 'hidden', borderBottomRightRadius: 0, },
            drawerLabelStyle: { fontFamily: 'Inter-Regular', fontSize: mscale(16) },
            drawerContentStyle: { paddingHorizontal: 0 },
            drawerContentContainerStyle: { paddingHorizontal: 0 },
            headerShadowVisible: false,
            headerTitleStyle: { fontFamily: 'Inter-Bold', fontSize: 16 }
        }
    },
});


export default SettingsDrawer
import { Tabs } from 'expo-router';
import TabIcon from '@expo/vector-icons/Ionicons';
import { Text, Pressable } from 'react-native';
import { colors } from '@/src/constants/theme';
import { hscale, mscale } from '@/src/helpers/metric';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.tabBarInactiveTintColor,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          elevation: 0,
          shadowOpacity: 0,
          borderTopWidth: 0,
          height: hscale(60),
        },
        // tabBarButton: (props) => <Pressable {...props} />,
      
      }}
      initialRouteName="index"
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarLabel: ({ focused }) => (
            <Text style={{ 
              fontFamily: 'Inter-Medium', 
              fontSize: mscale(12), 
              color: focused ? colors.primary : colors.tabBarInactiveTintColor 
            }}>
              Home
            </Text>
          ),
          tabBarIcon: ({ focused, color }) => (
            <TabIcon 
              name={focused ? 'home' : 'home-outline'} 
              color={color} 
              size={20} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="filter"
        options={{
          title: 'Filter',
          tabBarLabel: ({ focused }) => (
            <Text style={{ 
              fontFamily: 'Inter-Medium', 
              fontSize: mscale(12), 
              color: focused ? colors.primary : colors.tabBarInactiveTintColor 
            }}>
              Filter
            </Text>
          ),
          tabBarIcon: ({ focused, color }) => (
            <TabIcon 
              name={focused ? 'filter' : 'filter-outline'} 
              color={color} 
              size={20} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="downloads"
        options={{
          title: 'Downloads',
          tabBarLabel: ({ focused }) => (
            <Text style={{ 
              fontFamily: 'Inter-Medium', 
              fontSize: mscale(12), 
              color: focused ? colors.primary : colors.tabBarInactiveTintColor 
            }}>
              Downloads
            </Text>
          ),
          tabBarIcon: ({ focused, color }) => (
            <TabIcon 
              name={focused ? 'cloud-download' : 'cloud-download-outline'} 
              color={color} 
              size={20} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarLabel: ({ focused }) => (
            <Text style={{ 
              fontFamily: 'Inter-Medium', 
              fontSize: mscale(12), 
              color: focused ? colors.primary : colors.tabBarInactiveTintColor 
            }}>
              Settings
            </Text>
          ),
          tabBarIcon: ({ focused, color }) => (
            <TabIcon 
              name={focused ? 'settings' : 'settings-outline'} 
              color={color} 
              size={20} 
            />
          ),
        }}
      />
    </Tabs>
  );
}
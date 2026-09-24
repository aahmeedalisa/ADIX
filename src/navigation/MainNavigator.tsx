import React, { useState } from 'react';
import { View, Pressable, TextInput, useWindowDimensions, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '../context/StoreContext';
import { useDeveloper } from '../context/DeveloperContext';
import { developerVisible } from '../constants/developer';
import { Brand } from '../components/common/Brand';
import { Icon, Txt, IconButton, s, C } from '../components/common/UI';

import { HomeScreen } from '../screens/HomeScreen';
import { CategoriesScreen } from '../screens/CategoriesScreen';
import { OrdersScreen } from '../screens/OrdersScreen';
import { WalletScreen } from '../screens/WalletScreen';
import { ProfileScreen } from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const tabItems = [
  { name: 'Home', title: 'الرئيسية', icon: 'grid-outline', active: 'grid' },
  { name: 'Categories', title: 'الأقسام', icon: 'apps-outline', active: 'apps' },
  { name: 'Orders', title: 'طلباتي', icon: 'receipt-outline', active: 'receipt' },
  { name: 'Wallet', title: 'المحفظة', icon: 'wallet-outline', active: 'wallet' },
  { name: 'Profile', title: 'حسابي', icon: 'person-outline', active: 'person' },
];

// Desktop Sidebar Component
const DesktopSidebar: React.FC<{ navigation: any; active: string }> = ({ navigation, active }) => {
  const { settings, ready } = useDeveloper();
  const { state } = useStore();
  const { height } = useWindowDimensions();

  const unreadCount = state.notifications.filter(n => !n.read).length;

  const navigateTo = (screenName: string) => {
    if (tabItems.some(t => t.name === screenName)) {
      navigation.navigate('Main', { screen: screenName });
    } else {
      navigation.navigate(screenName);
    }
  };

  const renderItem = (name: string, label: string, icon: any, count?: string) => {
    const isCurrent = active === name;
    return (
      <Pressable
        key={name}
        onPress={() => navigateTo(name)}
        style={({ hovered }: any) => [
          s.row,
          styles.navItem,
          isCurrent && styles.navActive,
          hovered && { backgroundColor: isCurrent ? '#2C2C2C' : '#1C1C1C' },
        ]}
      >
        <Icon name={icon} size={20} color={isCurrent ? '#FFF' : '#858585'} />
        <Txt
          bold={isCurrent}
          style={{
            flex: 1,
            fontSize: 12,
            lineHeight: 19,
            color: isCurrent ? '#FFF' : '#919191',
          }}
        >
          {label}
        </Txt>
        {Boolean(count) && (
          <View style={styles.badgeBox}>
            <Txt style={{ fontSize: 9, color: '#BBB' }}>{count}</Txt>
          </View>
        )}
        {isCurrent && <View style={styles.activeBar} />}
      </Pressable>
    );
  };

  return (
    <View style={styles.sidebar}>
      {/* Brand */}
      <View style={styles.brandBox}>
        <Brand subtitle />
      </View>

      {/* Main Tabs */}
      <View style={{ paddingHorizontal: 16 }}>
        <Txt style={styles.navSectionLabel}>القائمة الرئيسية</Txt>
        {renderItem('Home', 'الرئيسية', active === 'Home' ? 'grid' : 'grid-outline')}
        {renderItem('Categories', 'جميع الأقسام', 'apps-outline')}
        {renderItem(
          'Orders',
          'طلباتي',
          'receipt-outline',
          state.orders.length ? String(state.orders.length) : undefined
        )}
        {renderItem('Wallet', 'المحفظة', 'wallet-outline')}

        <View style={styles.separator} />

        <Txt style={styles.navSectionLabel}>اكتشف المزيد</Txt>
        {renderItem('Coupons', 'الكوبونات والعروض', 'ticket-outline', 'جديد')}
        {renderItem(
          'Notifications',
          'الإشعارات',
          'notifications-outline',
          unreadCount ? String(unreadCount) : undefined
        )}
        {renderItem('Accounts', 'حساباتي المرتبطة', 'link-outline')}

        <View style={styles.separator} />

        {renderItem('Support', 'الدعم الفني', 'headset-outline')}
        {renderItem('About', 'من نحن', 'information-circle-outline')}
        {ready && developerVisible(settings, 'menu') && renderItem('Developer', 'حسابات المطور', 'code-slash-outline')}
      </View>

      <View style={{ flex: 1, minHeight: 20 }} />

      {/* Help Card */}
      {height >= 900 && (
        <View style={styles.helpCard}>
          <View style={[s.row, { justifyContent: 'space-between' }]}>
            <Icon name="headset-outline" size={24} color="#BBB" />
            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#899a8d' }} />
          </View>
          <Txt bold style={{ fontSize: 13, marginTop: 10 }}>نحن هنا لمساعدتك</Txt>
          <Txt style={{ fontSize: 10, color: '#737373', marginTop: 4 }}>
            سؤال أو استفسار؟ تواصل معنا مباشرة.
          </Txt>
          <Pressable
            onPress={() => navigateTo('Support')}
            style={[s.row, { justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#333', paddingTop: 10, marginTop: 12 }]}
          >
            <Txt bold style={{ fontSize: 11, color: '#CCC' }}>تواصل مع الدعم</Txt>
            <Icon name="arrow-back" size={14} color="#AAA" />
          </Pressable>
        </View>
      )}

      {/* Profile Footer */}
      <Pressable onPress={() => navigateTo('Profile')} style={styles.sidebarProfile}>
        <View style={styles.avatar}>
          <Icon name="person-outline" size={18} color="#BBB" />
        </View>
        <View style={{ flex: 1 }}>
          <Txt bold style={{ fontSize: 12 }}>
            {state.signedIn ? state.user?.name : 'حسابك في أديكس'}
          </Txt>
          <Txt style={{ color: '#777', fontSize: 10 }}>
            {state.signedIn ? (state.role === 'admin' ? 'مدير النظام' : 'الملف الشخصي') : 'تسجيل الدخول'}
          </Txt>
        </View>
        <Icon name="chevron-back" size={14} color="#777" />
      </Pressable>
    </View>
  );
};

// Mobile Bottom Tab Bar Component
const MobileTabBar: React.FC<{ state: any; navigation: any }> = ({ state, navigation }) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        flexDirection: 'row-reverse',
        backgroundColor: '#121212',
        borderTopWidth: 1,
        borderTopColor: '#2D2D2D',
        paddingBottom: Math.max(insets.bottom, 8),
        paddingTop: 8,
      }}
    >
      {state.routes.map((route: any, index: number) => {
        const item = tabItems[index];
        const isSelected = state.index === index;

        return (
          <Pressable
            key={route.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: isSelected }}
            style={{ flex: 1, alignItems: 'center', gap: 3 }}
            onPress={() => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });
              if (!isSelected && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            }}
          >
            <View
              style={{
                paddingHorizontal: 16,
                paddingVertical: 4,
                borderRadius: 8,
                backgroundColor: isSelected ? '#2A2A2A' : 'transparent',
              }}
            >
              <Icon
                name={isSelected ? item.active : item.icon}
                size={21}
                color={isSelected ? '#FFF' : '#707070'}
              />
            </View>
            <Txt bold={isSelected} style={{ fontSize: 10, color: isSelected ? '#EEE' : '#777' }}>
              {item.title}
            </Txt>
          </Pressable>
        );
      })}
    </View>
  );
};

export const MainNavigator: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1000;
  const isMobile = width < 650;
  const [activeTab, setActiveTab] = useState('Home');
  const [searchWord, setSearchWord] = useState('');
  const { state } = useStore();
  const { settings, ready } = useDeveloper();
  const insets = useSafeAreaInsets();

  const handleSearchSubmit = () => {
    navigation.navigate('Main', {
      screen: 'Categories',
      params: { query: searchWord.trim(), category: 'all' },
    });
  };

  return (
    <View style={{ flex: 1, flexDirection: 'row-reverse', backgroundColor: C.bg, paddingTop: insets.top }}>
      {/* Desktop Sidebar */}
      {isDesktop && <DesktopSidebar navigation={navigation} active={activeTab} />}

      {/* Main Content Area */}
      <View style={{ flex: 1 }}>
        {/* Top Navbar */}
        <View style={[styles.header, isMobile && { paddingHorizontal: 16, height: 66 }]}>
          {isMobile ? (
            <Brand small />
          ) : (
            <View style={[s.row, { minWidth: 95 }]}>
              <Txt bold style={{ fontSize: 15 }}>
                {tabItems.find(t => t.name === activeTab)?.title}
              </Txt>
              <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: '#666' }} />
            </View>
          )}

          {/* Desktop Search Bar */}
          {!isMobile && (
            <View style={styles.searchBar}>
              <Icon name="search-outline" size={17} color="#777" />
              <TextInput
                accessibilityLabel="ابحث عن خدمة"
                placeholder="ابحث عن لعبة، تطبيق، أو خدمة..."
                placeholderTextColor="#666"
                value={searchWord}
                onChangeText={setSearchWord}
                onSubmitEditing={handleSearchSubmit}
                returnKeyType="search"
                style={{
                  flex: 1,
                  color: '#DDD',
                  fontFamily: 'Tajawal',
                  fontSize: 12,
                  textAlign: 'right',
                  height: 38,
                }}
              />
              <Pressable onPress={handleSearchSubmit} style={styles.searchKey}>
                <Icon name="return-down-back-outline" color="#777" size={13} />
              </Pressable>
            </View>
          )}

          <View style={{ flex: 1 }} />

          {/* Top Right Controls */}
          <View style={[s.row, { gap: isMobile ? 8 : 12 }]}>
            {/* Developer Button if enabled and visible in menu */}
            {!isDesktop && ready && developerVisible(settings, 'menu') && (
              <IconButton
                icon="code-slash-outline"
                label="حسابات المطور"
                onPress={() => navigation.navigate('Developer')}
              />
            )}

            {!isMobile && (
              <View style={[s.row, { gap: 6 }]}>
                <Icon name="globe-outline" size={15} color="#909090" />
                <Txt style={{ color: '#AAA', fontSize: 11 }}>العربية</Txt>
                <View style={{ width: 1, height: 18, backgroundColor: '#333', marginHorizontal: 3 }} />
              </View>
            )}

            <IconButton
              icon="notifications-outline"
              badge={state.notifications.some(n => !n.read)}
              onPress={() => navigation.navigate('Notifications')}
              label="الإشعارات"
            />

            {isMobile && (
              <IconButton
                icon="search-outline"
                onPress={() => navigation.navigate('Main', { screen: 'Categories' })}
                label="بحث"
              />
            )}

            {!isMobile && (
              <Pressable
                onPress={() =>
                  navigation.navigate(state.signedIn ? 'Main' : 'Login', state.signedIn ? { screen: 'Profile' } : undefined)
                }
                style={[s.row, { gap: 8 }]}
              >
                <View style={styles.avatar}>
                  <Icon name="person" color="#9C9C9C" size={16} />
                </View>
                <View>
                  <Txt bold style={{ fontSize: 11, lineHeight: 17 }}>
                    {state.signedIn ? state.user?.name : 'مرحبًا، ضيفنا'}
                  </Txt>
                  <Txt style={{ fontSize: 9, color: '#767676' }}>
                    {state.signedIn ? 'حسابي الشخصي' : 'تسجيل الدخول'}
                  </Txt>
                </View>
                <Icon name="chevron-down" size={12} color="#888" />
              </Pressable>
            )}
          </View>
        </View>

        {/* Tab Navigator */}
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            animation: 'fade',
          }}
          screenListeners={({ route }) => ({
            focus: () => setActiveTab(route.name),
          })}
          tabBar={props => (isDesktop ? null : <MobileTabBar {...props} />)}
        >
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Categories" component={CategoriesScreen} />
          <Tab.Screen name="Orders" component={OrdersScreen} />
          <Tab.Screen name="Wallet" component={WalletScreen} />
          <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    width: 240,
    backgroundColor: '#0F0F0F',
    borderLeftWidth: 1,
    borderLeftColor: '#262626',
  },
  brandBox: {
    paddingTop: 24,
    paddingBottom: 20,
    paddingHorizontal: 24,
    alignItems: 'flex-end',
  },
  navSectionLabel: {
    fontSize: 10,
    color: '#707070',
    paddingHorizontal: 12,
    marginBottom: 10,
    marginTop: 8,
  },
  navItem: {
    paddingHorizontal: 13,
    height: 42,
    borderRadius: 8,
    gap: 12,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  navActive: {
    backgroundColor: '#242424',
    borderColor: '#383838',
  },
  activeBar: {
    position: 'absolute',
    right: -1,
    height: 18,
    width: 3,
    borderRadius: 2,
    backgroundColor: '#DDD',
  },
  badgeBox: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: '#303030',
  },
  separator: {
    height: 1,
    backgroundColor: '#222',
    marginVertical: 14,
    marginHorizontal: 12,
  },
  helpCard: {
    marginHorizontal: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#2D2D2D',
    backgroundColor: '#171717',
    borderRadius: 12,
    padding: 14,
  },
  sidebarProfile: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: '#262626',
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  avatar: {
    width: 32,
    height: 32,
    backgroundColor: '#282828',
    borderColor: '#404040',
    borderWidth: 1,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    height: 74,
    paddingHorizontal: 28,
    borderBottomWidth: 1,
    borderBottomColor: '#262626',
    backgroundColor: '#0F0F0F',
    gap: 18,
  },
  searchBar: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
    width: 290,
    height: 38,
    paddingHorizontal: 12,
    backgroundColor: '#181818',
    borderWidth: 1,
    borderColor: '#2E2E2E',
    borderRadius: 8,
  },
  searchKey: {
    backgroundColor: '#222',
    padding: 3,
    borderColor: '#333',
    borderWidth: 1,
    borderRadius: 4,
  },
});

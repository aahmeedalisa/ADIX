import React, { useState } from 'react';
import { View, Pressable, useWindowDimensions } from 'react-native';
import { useStore } from '../context/StoreContext';
import { Title, Icon, Txt, Button, Field, s, C } from '../components/common/UI';

export const ProfileScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { state, setState, logout, showToast } = useStore();
  const { width } = useWindowDimensions();
  const [editing, setEditing] = useState(false);
  const [nameInput, setNameInput] = useState(state.user?.name || '');

  const isAdmin = state.role === 'admin' || state.user?.role === 'admin';

  const handleSaveName = () => {
    if (nameInput.trim().length < 2) {
      return showToast('أدخل اسماً صحيحاً');
    }
    setState(prev => ({
      ...prev,
      user: prev.user ? { ...prev.user, name: nameInput.trim() } : null,
    }));
    setEditing(false);
    showToast('تم حفظ التعديلات بنجاح');
  };

  const menuItems = [
    {
      name: 'حساباتي المرتبطة',
      sub: 'إدارة معرّفات الألعاب وشبكات التواصل',
      icon: 'link-outline',
      route: 'Accounts',
    },
    {
      name: 'الكوبونات والعروض',
      sub: 'اكتشف خصوماتك المتاحة وكوبونات الشحن',
      icon: 'ticket-outline',
      route: 'Coupons',
    },
    {
      name: 'الإشعارات والتنبيهات',
      sub: 'تحديثات الطلبات وتأكيد الشحن',
      icon: 'notifications-outline',
      route: 'Notifications',
    },
    {
      name: 'الدعم الفني والمساعدة',
      sub: 'فريق الدعم متواجد على مدار 24 ساعة',
      icon: 'headset-outline',
      route: 'Support',
    },
    {
      name: 'من نحن',
      sub: 'تعرّف على رؤية ورسالة عالم أديكس',
      icon: 'information-circle-outline',
      route: 'About',
    },
    {
      name: 'الشروط والأحكام',
      sub: 'سياسة وضوابط استخدام متجر ADIX',
      icon: 'document-text-outline',
      route: 'Terms',
    },
    {
      name: 'سياسة الخصوصية',
      sub: 'حماية وأمان بياناتك الرقمية',
      icon: 'shield-checkmark-outline',
      route: 'Privacy',
    },
    {
      name: 'سياسة الاسترجاع والإلغاء',
      sub: 'ضمان حقوق العملاء واسترداد الرصيد',
      icon: 'refresh-outline',
      route: 'Refund',
    },
    {
      name: 'لوحة تحكم الإدارة',
      sub: 'مراجعة الطلبات، إعدادات الدفع، وإعدادات المطور',
      icon: 'grid-outline',
      route: 'Admin',
      badge: isAdmin ? 'مسؤول النظام' : 'تجريبي',
    },
  ];

  return (
    <View style={{ flex: 1, padding: width < 650 ? 18 : 30 }}>
      <Title title="حسابك، على طريقتك" subtitle="كل ما يخص حسابك ومحفظتك في مكان واحد." />

      {/* Profile Card */}
      <View style={[s.panel, { marginBottom: 20 }]}>
        <View style={[s.row, { gap: 16 }]}>
          <View
            style={{
              width: 64,
              height: 64,
              borderRadius: 20,
              backgroundColor: '#282828',
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: '#444',
            }}
          >
            {state.signedIn ? (
              <Txt bold style={{ fontSize: 26 }}>
                {state.user?.name ? state.user.name.charAt(0) : 'U'}
              </Txt>
            ) : (
              <Icon name="person-outline" size={28} color="#BBB" />
            )}
          </View>

          <View style={{ flex: 1 }}>
            <View style={[s.row, { gap: 8, alignItems: 'center' }]}>
              <Txt bold style={{ fontSize: 20 }}>
                {state.signedIn ? state.user?.name : 'أهلًا بك، ضيفنا العزيز'}
              </Txt>
              {state.signedIn && (
                <View
                  style={[
                    s.badge,
                    {
                      backgroundColor: isAdmin ? '#3d3419' : '#222',
                      borderColor: isAdmin ? '#d4af37' : '#444',
                      borderWidth: 1,
                    },
                  ]}
                >
                  <Txt
                    style={{
                      fontSize: 10,
                      color: isAdmin ? '#ffdb70' : '#899a8d',
                    }}
                  >
                    {isAdmin ? 'مسؤول النظام' : 'عميل مميز'}
                  </Txt>
                </View>
              )}
            </View>
            <Txt style={{ color: '#999', fontSize: 12, marginTop: 4 }}>
              {state.signedIn
                ? state.user?.email
                : 'سجّل دخولك لتخصيص محفظتك وحفظ طلباتك'}
            </Txt>
          </View>

          {state.signedIn && (
            <Pressable
              onPress={() => {
                setNameInput(state.user?.name || '');
                setEditing(!editing);
              }}
              style={s.iconBtn}
            >
              <Icon name="create-outline" size={18} />
            </Pressable>
          )}
        </View>

        {!state.signedIn && (
          <View style={[s.row, { marginTop: 18, gap: 10 }]}>
            <Button
              label="تسجيل الدخول"
              onPress={() => navigation.navigate('Login')}
              style={{ flex: 1 }}
            />
            <Button
              label="إنشاء حساب"
              secondary
              onPress={() => navigation.navigate('Register')}
              style={{ flex: 1 }}
            />
          </View>
        )}

        {editing && (
          <View style={{ marginTop: 18, paddingTop: 14, borderTopWidth: 1, borderTopColor: '#282828' }}>
            <Field label="الاسم الكامل" value={nameInput} onChangeText={setNameInput} />
            <Button label="حفظ التعديلات" onPress={handleSaveName} />
          </View>
        )}
      </View>

      {/* Menu Navigation Items */}
      {menuItems.map(item => (
        <Pressable
          key={item.route}
          onPress={() => navigation.navigate(item.route)}
          style={({ hovered }: any) => [
            s.panel,
            s.row,
            { marginBottom: 8, padding: 15 },
            hovered && { backgroundColor: '#202020' },
          ]}
        >
          <Icon name={item.icon} color="#DDD" size={22} />
          <View style={{ flex: 1 }}>
            <View style={[s.row, { gap: 6 }]}>
              <Txt bold style={{ fontSize: 13 }}>{item.name}</Txt>
              {item.badge && (
                <View style={[s.badge, { paddingHorizontal: 6, paddingVertical: 2 }]}>
                  <Txt style={{ fontSize: 9 }}>{item.badge}</Txt>
                </View>
              )}
            </View>
            <Txt style={{ color: C.muted, fontSize: 11, marginTop: 2 }}>{item.sub}</Txt>
          </View>
          <Icon name="chevron-back" size={14} color="#777" />
        </Pressable>
      ))}

      {state.signedIn && (
        <Button
          label="تسجيل الخروج"
          icon="log-out-outline"
          secondary
          onPress={logout}
          style={{ marginTop: 16 }}
        />
      )}

      <Txt style={{ textAlign: 'center', color: '#555', fontSize: 11, marginTop: 20 }}>
        ADIX • النسخة المتكاملة 1.0 (Production-Ready)
      </Txt>
    </View>
  );
};

import React, { useState } from 'react';
import { View, Pressable } from 'react-native';
import { useStore } from '../context/StoreContext';
import { ModalSheet } from '../components/common/ModalSheet';
import { Page, Icon, Txt, Button, Field, Empty, s, C } from '../components/common/UI';

export const AccountsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { state, addAccount, removeAccount, showToast } = useStore();
  const [platform, setPlatform] = useState('Instagram');
  const [username, setUsername] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const platforms = ['Instagram', 'TikTok', 'YouTube', 'Facebook', 'X', 'PUBG'];

  const handleSave = () => {
    if (username.trim().length < 2) {
      return showToast('أدخل معرّف حساب صحيح');
    }
    if (state.accounts.some(a => a.platform === platform && a.username === username.trim())) {
      return showToast('هذا الحساب مضاف بالفعل');
    }
    addAccount(platform, username.trim());
    setShowAddForm(false);
    setUsername('');
  };

  return (
    <ModalSheet
      title="حساباتي المرتبطة"
      subtitle="احتفظ بمعرّفات حساباتك لتسهيل الشحن، دون كلمات مرور"
      navigation={navigation}
    >
      <Page style={{ padding: 24 }}>
        {state.accounts.map(acc => (
          <View key={acc.id} style={[s.panel, s.row, { marginBottom: 12 }]}>
            <Icon name="person-circle-outline" size={32} color="#DDD" />
            <View style={{ flex: 1 }}>
              <Txt bold>{acc.platform}</Txt>
              <Txt style={{ fontSize: 12, color: C.muted }}>{acc.username}</Txt>
            </View>
            <Pressable
              accessibilityLabel="حذف الحساب"
              onPress={() => removeAccount(acc.id)}
              style={s.iconBtn}
            >
              <Icon name="trash-outline" size={18} color="#999" />
            </Pressable>
          </View>
        ))}

        {!state.accounts.length && !showAddForm && (
          <Empty
            icon="link-outline"
            title="لا توجد حسابات محفوظة"
            body="احفظ معرّف اللاعب أو حساباتك لتسهيل اختيارها عند تقديم أي طلب."
          />
        )}

        {showAddForm ? (
          <View style={[s.panel, { marginTop: 14 }]}>
            <Txt bold style={{ marginBottom: 12 }}>اختر المنصة</Txt>
            <View style={[s.row, { flexWrap: 'wrap', gap: 8, marginBottom: 18 }]}>
              {platforms.map(p => (
                <Pressable
                  key={p}
                  onPress={() => setPlatform(p)}
                  style={{
                    backgroundColor: p === platform ? '#FFF' : '#242424',
                    borderRadius: 7,
                    paddingHorizontal: 12,
                    paddingVertical: 7,
                  }}
                >
                  <Txt style={{ color: p === platform ? '#111' : '#BBB', fontSize: 12 }}>{p}</Txt>
                </Pressable>
              ))}
            </View>

            <Field
              label="اسم المستخدم أو المعرّف (ID)"
              value={username}
              onChangeText={setUsername}
              placeholder="@username أو Player ID"
              autoCapitalize="none"
            />

            <View style={[s.row, { gap: 10 }]}>
              <Button label="حفظ الحساب" onPress={handleSave} style={{ flex: 1 }} />
              <Button
                label="إلغاء"
                secondary
                onPress={() => setShowAddForm(false)}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        ) : (
          <Button
            label="إضافة حساب جديد"
            icon="add"
            onPress={() => setShowAddForm(true)}
            style={{ marginTop: 14 }}
          />
        )}
      </Page>
    </ModalSheet>
  );
};

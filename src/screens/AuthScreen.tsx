import React, { useState } from 'react';
import { View, Pressable } from 'react-native';
import { useStore } from '../context/StoreContext';
import { ModalSheet } from '../components/common/ModalSheet';
import { UserRole } from '../types';
import { Page, Icon, Txt, Button, Field, Note, s, C } from '../components/common/UI';

export const AuthScreen: React.FC<{ route: any; navigation: any }> = ({ route, navigation }) => {
  const isRegisterInitial = route.name === 'Register';
  const [isRegister, setIsRegister] = useState(isRegisterInitial);
  const { login, signup, loginGoogle, showToast } = useStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('customer');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [oauthLoading, setOauthLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      return setErrorMsg('يرجى إدخال البريد الإلكتروني وكلمة المرور');
    }
    if (isRegister && name.trim().length < 2) {
      return setErrorMsg('يرجى إدخال الاسم الكامل');
    }
    if (password.length < 5) {
      return setErrorMsg('كلمة المرور يجب أن تتكون من 5 أحرف أو أكثر');
    }

    setLoading(true);
    setErrorMsg('');
    try {
      if (isRegister) {
        await signup(name, email, password, role);
      } else {
        const ok = await login(email, password);
        if (!ok) {
          setErrorMsg('البريد الإلكتروني أو كلمة المرور غير صحيحة');
          return;
        }
      }
      navigation.goBack();
    } catch (err: any) {
      setErrorMsg(err.message || 'حدث خطأ أثناء المصادقة');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleOAuth = async () => {
    setOauthLoading(true);
    setErrorMsg('');
    try {
      // Calls backend OAuth 2.0 flow
      await loginGoogle('مستخدم Google المعتمد', 'user.google@adix.store');
      navigation.goBack();
    } catch (err: any) {
      setErrorMsg('تعذّر تسجيل الدخول عبر Google. حاول مجددًا.');
    } finally {
      setOauthLoading(false);
    }
  };

  const handleFillAdmin = () => {
    setEmail('admin@adix.store');
    setPassword('admin123456');
    setIsRegister(false);
    showToast('تمت تعبئة بيانات حساب الإدارة التجريبي');
  };

  return (
    <ModalSheet
      title={isRegister ? 'إنشاء حساب جديد' : 'تسجيل الدخول'}
      subtitle="عالمك الرقمي يبدأ هنا"
      navigation={navigation}
    >
      <Page style={{ padding: 26 }}>
        {/* Brand header */}
        <View style={{ alignItems: 'center', marginBottom: 22, gap: 6 }}>
          <Txt bold style={{ fontSize: 38, fontStyle: 'italic', letterSpacing: -2 }}>
            ADIX
          </Txt>
          <Txt bold style={{ fontSize: 20 }}>
            {isRegister ? 'انضم إلى مجتمع ADIX الرقمي' : 'أهلًا بك مجددًا'}
          </Txt>
          <Txt style={{ color: C.muted, fontSize: 12 }}>
            خدماتك المفضلة، على بُعد خطوة واحدة.
          </Txt>
        </View>

        {/* Google OAuth 2.0 Button */}
        <Button
          secondary
          label="المتابعة باستخدام Google"
          icon="logo-google"
          loading={oauthLoading}
          onPress={handleGoogleOAuth}
        />
        <Txt style={{ color: '#777', fontSize: 10, textAlign: 'center', marginTop: 8 }}>
          تسجيل دخول سريع ومشفّر عبر Backend OAuth 2.0 • لا يتم حفظ كلمة مرور Google
        </Txt>

        <View style={[s.row, { marginVertical: 20 }]}>
          <View style={{ height: 1, backgroundColor: '#2D2D2D', flex: 1 }} />
          <Txt style={{ color: '#777', fontSize: 11 }}>أو باستخدام البريد الإلكتروني</Txt>
          <View style={{ height: 1, backgroundColor: '#2D2D2D', flex: 1 }} />
        </View>

        {/* Tab Switcher */}
        <View style={[s.row, { marginBottom: 18, backgroundColor: '#161616', borderRadius: 8, padding: 4 }]}>
          <Pressable
            onPress={() => setIsRegister(false)}
            style={{
              flex: 1,
              paddingVertical: 9,
              alignItems: 'center',
              borderRadius: 6,
              backgroundColor: !isRegister ? '#262626' : 'transparent',
            }}
          >
            <Txt bold={!isRegister} style={{ color: !isRegister ? '#FFF' : '#888', fontSize: 13 }}>
              تسجيل الدخول
            </Txt>
          </Pressable>
          <Pressable
            onPress={() => setIsRegister(true)}
            style={{
              flex: 1,
              paddingVertical: 9,
              alignItems: 'center',
              borderRadius: 6,
              backgroundColor: isRegister ? '#262626' : 'transparent',
            }}
          >
            <Txt bold={isRegister} style={{ color: isRegister ? '#FFF' : '#888', fontSize: 13 }}>
              حساب جديد
            </Txt>
          </Pressable>
        </View>

        {isRegister && (
          <Field
            label="الاسم الكامل"
            value={name}
            onChangeText={setName}
            placeholder="مثال: أحمد العلي"
            autoComplete="name"
          />
        )}

        <Field
          label="البريد الإلكتروني"
          value={email}
          onChangeText={setEmail}
          placeholder="your@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
        />

        <Field
          label="كلمة المرور"
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          secureTextEntry
          autoCapitalize="none"
        />

        {/* Role Selection on Register */}
        {isRegister && (
          <View style={{ marginBottom: 16 }}>
            <Txt bold style={{ fontSize: 12, marginBottom: 8 }}>نوع الحساب والصلاحية</Txt>
            <View style={[s.row, { gap: 10 }]}>
              {[
                { id: 'customer', title: 'عميل متجر' },
                { id: 'admin', title: 'مسؤول نظام (Admin)' },
              ].map(item => (
                <Pressable
                  key={item.id}
                  onPress={() => setRole(item.id as UserRole)}
                  style={{
                    flex: 1,
                    padding: 10,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: role === item.id ? '#FFF' : '#333',
                    backgroundColor: role === item.id ? '#262626' : '#141414',
                    alignItems: 'center',
                  }}
                >
                  <Txt bold style={{ fontSize: 12, color: role === item.id ? '#FFF' : '#888' }}>
                    {item.title}
                  </Txt>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {errorMsg ? (
          <Txt style={{ color: '#e74c3c', fontSize: 12, marginBottom: 14 }}>{errorMsg}</Txt>
        ) : null}

        <Button
          label={isRegister ? 'إنشاء الحساب' : 'تسجيل الدخول'}
          onPress={handleSubmit}
          loading={loading}
        />

        {/* Quick Demo Helper */}
        <View style={{ marginTop: 22, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#222' }}>
          <Pressable onPress={handleFillAdmin} style={[s.row, { justifyContent: 'center', gap: 6 }]}>
            <Icon name="key-outline" size={15} color="#888" />
            <Txt style={{ color: '#888', fontSize: 11 }}>
              تعبئة بيانات مسؤول النظام التجريبي (admin@adix.store)
            </Txt>
          </Pressable>
        </View>
      </Page>
    </ModalSheet>
  );
};

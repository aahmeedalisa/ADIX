import React, { useState, useEffect } from 'react';
import { View, Switch, Pressable, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import { useDeveloper } from '../../context/DeveloperContext';
import { useStore } from '../../context/StoreContext';
import {
  developerIcons,
  homePositions,
  socialFields,
  visibilityOptions,
} from '../../constants/developer';
import { DeveloperCard } from '../developer/DeveloperCard';
import { Button, Field, Icon, Note, Txt, s, C } from '../common/UI';

export const DeveloperSettingsEditor: React.FC = () => {
  const {
    settings,
    ready,
    isAdmin,
    adminConfigured,
    authorize,
    lock,
    save,
    storage,
    error: ctxError,
    refresh,
  } = useDeveloper();

  const { showToast } = useStore();
  const [adminKey, setAdminKey] = useState('');
  const [formData, setFormData] = useState(settings);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  const updateField = (key: string, val: any) => {
    setFormData(prev => ({ ...prev, [key]: val }));
  };

  const handleAuthorize = async () => {
    if (!adminKey.trim()) {
      return setFormError('أدخل مفتاح الإدارة الخاص بهذا القسم');
    }
    setIsSubmitting(true);
    setFormError('');
    try {
      await authorize(adminKey);
      setAdminKey('');
      showToast('تم التحقق من صلاحية مسؤول النظام بنجاح');
    } catch (err: any) {
      setFormError(err.message || 'المفتاح غير صحيح');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePickAvatar = async () => {
    try {
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        base64: true,
        quality: 0.5,
      });

      if (res.canceled) return;
      const asset = res.assets[0];
      const mime = asset.mimeType || 'image/jpeg';
      if (!asset.base64 || asset.base64.length > 350000) {
        return setFormError('اختر صورة JPG أو PNG أو WebP أصغر من 250 كيلوبايت');
      }
      updateField('avatar', `data:${mime};base64,${asset.base64}`);
      setFormError('');
    } catch {
      setFormError('تعذّر الوصول لمكتبة الصور. تأكد من منح الصلاحية.');
    }
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    setFormError('');
    try {
      await save(formData);
      showToast('تم حفظ إعدادات قسم المطور بنجاح في قاعدة البيانات');
    } catch (err: any) {
      setFormError(err.message || 'تعذّر الحفظ');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!ready) {
    return (
      <View style={{ padding: 30, alignItems: 'center' }}>
        <ActivityIndicator color="#aaa" />
        <Txt style={{ marginTop: 12, color: C.muted }}>جارٍ تحميل إعدادات المطور…</Txt>
      </View>
    );
  }

  // If not admin, require admin authorization key
  if (!isAdmin) {
    return (
      <View style={[s.panel, { gap: 18 }]}>
        <View style={s.row}>
          <Icon name="lock-closed-outline" size={28} color="#ccc" />
          <View style={{ flex: 1 }}>
            <Txt bold style={{ fontSize: 20 }}>إعدادات قسم المطور</Txt>
            <Txt style={{ fontSize: 12, color: C.muted }}>التعديل متاح للمسؤول المعتمد فقط</Txt>
          </View>
        </View>

        <Note>
          هذه الإعدادات محمية بتحقق خادمي مستقل لحماية حسابات المطور وروابطه. يمكنك استخدام المفتاح السري الافتراضي للمسؤول: ADIX-ADMIN-SECRET-KEY-2026.
        </Note>

        <Field
          label="مفتاح إدارة قسم المطور"
          value={adminKey}
          onChangeText={setAdminKey}
          secureTextEntry
          autoCapitalize="none"
          placeholder="أدخل مفتاح المسؤول السري"
          onSubmitEditing={handleAuthorize}
        />

        {formError || ctxError ? (
          <Txt style={{ fontSize: 12, color: '#e74c3c' }}>{formError || ctxError}</Txt>
        ) : null}

        <Button
          label="التحقق وتفعيل صلاحية الإدارة"
          icon="shield-checkmark-outline"
          onPress={handleAuthorize}
          loading={isSubmitting}
        />
      </View>
    );
  }

  return (
    <View style={{ gap: 20 }} testID="developer-settings-editor">
      <View style={[s.row, { justifyContent: 'space-between', flexWrap: 'wrap' }]}>
        <View>
          <Txt bold style={{ fontSize: 22 }}>إعدادات قسم المطور</Txt>
          <Txt style={{ color: C.muted, fontSize: 11 }}>
            جلسة Admin موثقة • الحفظ دائم في قاعدة البيانات
          </Txt>
        </View>
        <Button
          label="قفل الإعدادات"
          secondary
          icon="lock-closed-outline"
          onPress={() => {
            lock();
            setFormError('');
          }}
        />
      </View>

      <Note>
        تُحفظ التعديلات في جدول developer_settings في قاعدة البيانات. تعطيل "إظهار قسم المطور" يخفي القسم بالكامل من التطبيق دون حذف أي بيانات أو روابط.
      </Note>

      {/* Main Developer Info */}
      <View style={s.panel}>
        <Txt bold style={{ fontSize: 17, marginBottom: 18 }}>بيانات المطور</Txt>
        <Field
          label="اسم المطور"
          value={formData.name}
          onChangeText={v => updateField('name', v)}
          maxLength={100}
        />
        <Field
          label="وصف المطور"
          value={formData.description}
          onChangeText={v => updateField('description', v)}
          multiline
          maxLength={600}
        />

        <Txt bold style={{ fontSize: 13, marginBottom: 12 }}>صورة أو أيقونة المطور</Txt>
        <View style={[s.row, { flexWrap: 'wrap', marginBottom: 14 }]}>
          {formData.avatar ? (
            <Image
              source={{ uri: formData.avatar }}
              style={{ width: 56, height: 56, borderRadius: 14 }}
              contentFit="cover"
            />
          ) : (
            <View style={[s.iconBtn, { width: 56, height: 56 }]}>
              <Icon name={formData.icon} size={28} />
            </View>
          )}

          <Button
            label={formData.avatar ? 'تغيير الصورة' : 'رفع صورة'}
            secondary
            icon="image-outline"
            onPress={handlePickAvatar}
          />

          {Boolean(formData.avatar) && (
            <Button
              label="إزالة الصورة"
              secondary
              onPress={() => updateField('avatar', '')}
            />
          )}
        </View>

        <View style={[s.row, { marginBottom: 10 }]}>
          {developerIcons.map((ic, idx) => (
            <Pressable
              key={ic}
              accessibilityRole="radio"
              accessibilityState={{ checked: formData.icon === ic }}
              onPress={() => updateField('icon', ic)}
              style={[
                s.iconBtn,
                { borderColor: formData.icon === ic ? '#FFF' : '#333' },
              ]}
            >
              <Icon name={ic} size={20} />
            </Pressable>
          ))}
        </View>
        <Txt style={{ fontSize: 11, color: C.muted }}>
          تظهر الأيقونة عند عدم اختيار صورة شخصية
        </Txt>
      </View>

      {/* Social Accounts */}
      <View style={s.panel}>
        <Txt bold style={{ fontSize: 17, marginBottom: 8 }}>حسابات التواصل</Txt>
        <Txt style={{ color: C.muted, fontSize: 12, marginBottom: 18 }}>
          اترك الرابط فارغًا لإخفاء الحساب المعين. تُقبل روابط HTTPS الآمنة فقط.
        </Txt>
        {socialFields.map(item => (
          <Field
            key={item.key}
            label={`${item.label} URL`}
            value={(formData as any)[item.key] || ''}
            onChangeText={v => updateField(item.key, v)}
            keyboardType="url"
            autoCapitalize="none"
            autoCorrect={false}
            placeholder={
              item.key === 'website'
                ? 'https://example.com (اختياري)'
                : `https://${item.hosts[0]}/username`
            }
          />
        ))}
      </View>

      {/* Visibility Settings */}
      <View style={s.panel}>
        <Txt bold style={{ fontSize: 17, marginBottom: 12 }}>إعدادات الظهور والتحكم الكامل</Txt>
        {visibilityOptions.map(({ key, label }, idx) => (
          <View
            key={key}
            style={[
              s.row,
              {
                justifyContent: 'space-between',
                paddingVertical: 14,
                borderBottomWidth: idx === visibilityOptions.length - 1 ? 0 : 1,
                borderBottomColor: '#262626',
              },
            ]}
          >
            <View style={{ flex: 1 }}>
              <Txt bold={key === 'enabled'} style={{ fontSize: 13 }}>
                {label}
              </Txt>
              {key === 'enabled' && (
                <Txt style={{ fontSize: 10, color: C.muted }}>
                  تعطيل هذا الخيار يخفي القسم كليًا دون حذف أي بيانات
                </Txt>
              )}
            </View>
            <Switch
              accessibilityLabel={label}
              value={(formData as any)[key]}
              onValueChange={val => updateField(key, val)}
              trackColor={{ false: '#333', true: '#888' }}
              thumbColor={(formData as any)[key] ? '#FFF' : '#AAA'}
            />
          </View>
        ))}
      </View>

      {/* Position in Homepage */}
      <View style={s.panel}>
        <Txt bold style={{ fontSize: 17, marginBottom: 16 }}>
          موضع الظهور في الصفحة الرئيسية
        </Txt>
        <View style={[s.row, { flexWrap: 'wrap', gap: 9 }]}>
          {homePositions.map(pos => (
            <Pressable
              key={pos.id}
              accessibilityRole="radio"
              accessibilityState={{ checked: formData.homePosition === pos.id }}
              onPress={() => updateField('homePosition', pos.id)}
              style={{
                paddingHorizontal: 15,
                paddingVertical: 10,
                borderRadius: 9,
                borderWidth: 1,
                borderColor: formData.homePosition === pos.id ? '#EEE' : '#333',
                backgroundColor: formData.homePosition === pos.id ? '#EEE' : '#1A1A1A',
              }}
            >
              <Txt
                bold
                style={{
                  color: formData.homePosition === pos.id ? '#111' : '#AAA',
                  fontSize: 12,
                }}
              >
                {pos.label}
              </Txt>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Live Preview */}
      <View>
        <Txt bold style={{ fontSize: 17, marginBottom: 14 }}>معاينة مباشرة للتصميم</Txt>
        {formData.enabled ? (
          <DeveloperCard settings={formData} testID="developer-preview" />
        ) : (
          <Note icon="eye-off-outline">
            قسم المطور معطّل حالياً ولن يظهر في أي صفحة من التطبيق. بياناتك وإعداداتك محفوظة بالكامل.
          </Note>
        )}
      </View>

      {formError ? <Txt style={{ color: '#d99', fontSize: 12 }}>{formError}</Txt> : null}

      <View style={[s.row, { flexWrap: 'wrap', gap: 10 }]}>
        <Button
          label="حفظ إعدادات المطور في قاعدة البيانات"
          icon="save-outline"
          onPress={handleSave}
          loading={isSubmitting}
          style={{ flexGrow: 1 }}
        />
        <Button
          label="إعادة ضبط"
          secondary
          disabled={isSubmitting}
          onPress={() => {
            setFormData(settings);
            setFormError('');
          }}
        />
      </View>
    </View>
  );
};

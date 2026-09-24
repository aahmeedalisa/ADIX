import React, { useState } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import { useStore } from '../context/StoreContext';
import { ModalSheet } from '../components/common/ModalSheet';
import { Page, Icon, Txt, Button, Field, Note, s, C } from '../components/common/UI';

export const ProofScreen: React.FC<{ route: any; navigation: any }> = ({ route, navigation }) => {
  const { addOrder } = useStore();
  const [transactionRef, setTransactionRef] = useState('');
  const [proofImage, setProofImage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handlePickImage = async () => {
    try {
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        base64: true,
        quality: 0.6,
      });

      if (!res.canceled) {
        const asset = res.assets[0];
        const uri = asset.base64
          ? `data:${asset.mimeType || 'image/jpeg'};base64,${asset.base64}`
          : asset.uri;
        setProofImage(uri);
        setErrorMsg('');
      }
    } catch {
      setErrorMsg('تعذّر الوصول لمكتبة الصور. يرجى التحقق من الأذونات.');
    }
  };

  const handleSubmit = () => {
    if (transactionRef.trim().length < 3) {
      return setErrorMsg('أدخل رقم عملية شام كاش أو رقم مرجع التحويل');
    }
    if (!proofImage) {
      return setErrorMsg('يرجى إرفاق صورة إشعار التحويل');
    }

    setSubmitting(true);
    const newOrder = addOrder({
      ...route.params?.order,
      transaction: transactionRef.trim(),
      proof: proofImage,
    });

    navigation.replace('OrderDetail', { id: newOrder.id, created: true });
  };

  return (
    <ModalSheet
      title="إرفاق إثبات الدفع"
      subtitle="الخطوة الأخيرة لبدء تنفيذ طلبك"
      navigation={navigation}
    >
      <Page style={{ padding: 25 }}>
        <Field
          label="رقم العملية / مرجع التحويل"
          value={transactionRef}
          onChangeText={setTransactionRef}
          placeholder="مثال: SHAM-8941294"
        />

        <Txt bold style={{ marginBottom: 10, fontSize: 13 }}>صورة إشعار التحويل</Txt>
        <Pressable
          onPress={handlePickImage}
          style={({ hovered }: any) => [
            styles.uploadBox,
            hovered && { borderColor: '#888' },
          ]}
        >
          {proofImage ? (
            <>
              <Image source={{ uri: proofImage }} style={StyleSheet.absoluteFill} contentFit="contain" />
              <View style={styles.changeOverlay}>
                <Txt style={{ fontSize: 12 }}>اضغط لتغيير الصورة</Txt>
              </View>
            </>
          ) : (
            <View style={{ alignItems: 'center', gap: 8 }}>
              <Icon name="cloud-upload-outline" size={38} color="#AAA" />
              <Txt bold>اضغط لاختيار صورة الإيصال</Txt>
              <Txt style={{ fontSize: 11, color: C.muted }}>JPG أو PNG أو WebP</Txt>
            </View>
          )}
        </Pressable>

        <View style={{ marginVertical: 20 }}>
          <Note>
            تتم مراجعة الإثبات وتأكيد الشحن فور التحقق من الحوالة من قبل فريق الدعم الفني.
          </Note>
        </View>

        {errorMsg ? (
          <Txt style={{ color: '#d99', fontSize: 12, marginBottom: 15 }}>{errorMsg}</Txt>
        ) : null}

        <Button
          label="إرسال الطلب للمراجعة والاعتماد"
          icon="checkmark"
          onPress={handleSubmit}
          loading={submitting}
        />
      </Page>
    </ModalSheet>
  );
};

const styles = StyleSheet.create({
  uploadBox: {
    height: 200,
    borderRadius: 14,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#4E4E4E',
    backgroundColor: '#161616',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  changeOverlay: {
    position: 'absolute',
    bottom: 10,
    backgroundColor: 'rgba(0,0,0,0.75)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 8,
  },
});

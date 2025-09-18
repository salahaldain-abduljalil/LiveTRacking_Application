import React, { useState } from 'react';
import {
    View,
    Text,
    Switch,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
    Map: undefined;
    Destination: undefined;
    Settings: undefined;
};

type SettingsScreenProp = NativeStackNavigationProp<RootStackParamList, 'Settings'>;

type SettingItem = {
    id: string;
    title: string;
    description?: string;
    value?: boolean | string;
    onPress?: () => void;
};

export default function SettingsScreen() {
    const navigation = useNavigation<SettingsScreenProp>();

    // حالات UI افتراضية  
    const [locationSharing, setLocationSharing] = useState<boolean>(true);
    const [denseMode, setDenseMode] = useState<boolean>(false);
    const [theme, setTheme] = useState<string>('الآلي'); // مثال: Auto / Light / Dark  

    const settingsData: SettingItem[] = [
        {
            id: 's1',
            title: 'مشاركة الموقع',
            description: 'اسمح للتطبيق بمشاركة موقعك لتحسين التوجيه',
            value: locationSharing,
            onPress: () => setLocationSharing((v) => !v),
        },
        {
            id: 's2',
            title: 'وضع العدد الكثيف',
            description: 'تصغير المسافات لعرض أكثر كثافة في الشاشة',
            value: denseMode,
            onPress: () => setDenseMode((v) => !v),
        },
        {
            id: 's3',
            title: 'المظهر',
            description: `المظهر الحالي: ${theme}`,
            value: theme,
            onPress: () => {
                // خيار بسيط لتغيير الثيم: Auto -> Light -> Dark  
                const next = theme === 'الآلي' ? 'فاتح' : theme === 'فاتح' ? 'داكن' : 'الآلي';
                setTheme(next);
            },
        },
        {
            id: 's4',
            title: 'إعادة تعيين البيانات الافتراضية',
            description: 'سيعيد التطبيق إعداداته إلى القيم الافتراضية',
            onPress: () => {
                // عمليات UI-only لإعطاء إحساس بالإعادة  
                setLocationSharing(true);
                setDenseMode(false);
                setTheme('الآلي');
            },
        },
    ];

    const renderItem = ({ item }: { item: SettingItem }) => (
        <TouchableOpacity style={styles.settingItem} onPress={item.onPress}>
            <View style={styles.settingText}>
                <Text style={styles.settingTitle}>{item.title}</Text>
                {item.description ? (
                    <Text style={styles.settingDescription}>{item.description}</Text>
                ) : null}
            </View>
            {typeof item.value === 'boolean' ? (
                <Switch
                    value={item.value}
                    onValueChange={item.onPress}
                    trackColor={{ false: '#d1d5db', true: '#4ade80' }}
                    thumbColor="#fff"
                />
            ) : (
                <Text style={styles.settingValue}>{String(item.value)}</Text>
            )}
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>الإعدادات</Text>
                <Text style={styles.headerSubtitle}>إعدادات التطبيق لتحسين تجربتك</Text>
            </View>

            <FlatList
                data={settingsData}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
            />

            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.footerButton}
                    onPress={() => {
                        // مثال: حفظ افتراضي وإعادة توجيه للخريطة  
                        navigation.navigate('Map' as any);
                    }}
                >
                    <Text style={styles.footerButtonText}>حفظ والعودة إلى الخريطة</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.footerButtonSecondary}
                    onPress={() => {
                        // مثال: إعادة تعيين الإعدادات ثم العودة
                        setLocationSharing(true);
                        setDenseMode(false);
                        setTheme('الآلي');
                        // خيار: اعادة تعيين القيم في الواجهة فقط
                        // يمكنك أيضًا إضافة إعادة تعيين من الناحية البرمجية في الـ state أو استدعاء API وهمي هنا إذا رغبت
                    }}
                >
                    <Text style={styles.footerButtonTextSecondary}>إعادة التعيين ثم الرجوع</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7f8fa',
    },
    header: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
        backgroundColor: '#fff',
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1f2937',
    },
    headerSubtitle: {
        fontSize: 13,
        color: '#6b7280',
    },
    list: {
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eef2f7',
    },
    settingText: {
        flex: 1,
        paddingRight: 8,
    },
    settingTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1f2937',
    },
    settingDescription: {
        fontSize: 12,
        color: '#6b7280',
        marginTop: 4,
    },
    settingValue: {
        fontSize: 14,
        color: '#374151',
        paddingHorizontal: 8,
    },
    footer: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 12,
        paddingHorizontal: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    footerButton: {
        backgroundColor: '#1f2937',
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderRadius: 10,
    },
    footerButtonText: {
        color: '#fff',
        fontWeight: '700',
    },
    footerButtonSecondary: {
        backgroundColor: '#e5e7eb',
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderRadius: 10,
    },
    footerButtonTextSecondary: {
        color: '#1f2937',
        fontWeight: '700',
    },
});
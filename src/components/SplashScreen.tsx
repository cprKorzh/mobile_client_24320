import React, {useEffect, useRef} from 'react';
import {View, StyleSheet, Animated, Dimensions} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {Ionicons} from '@expo/vector-icons';
import {Text} from './Themed';
import {Logo} from "./Logo";

const {width, height} = Dimensions.get('window');

interface CustomSplashScreenProps {
    onFinish: () => void;
}

export const CustomSplashScreen: React.FC<CustomSplashScreenProps> = ({onFinish}) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.5)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const progressAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Анимация появления
        Animated.sequence([
            // Появление иконки
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    tension: 50,
                    friction: 7,
                    useNativeDriver: true,
                }),
            ]),
            // Появление текста
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 600,
                useNativeDriver: true,
            }),
        ]).start();

        // Анимация прогресс-бара
        Animated.timing(progressAnim, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: false,
        }).start();

        // Автоматическое закрытие через 3 секунды
        const timer = setTimeout(() => {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }).start(() => {
                onFinish();
            });
        }, 3000);

        return () => clearTimeout(timer);
    }, [fadeAnim, scaleAnim, slideAnim, progressAnim, onFinish]);

    return (
        <LinearGradient
            colors={['#ffffff', '#fd2b64', '#FC094C']}
            style={styles.container}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
        >
            <Animated.View
                style={[
                    styles.content,
                    {
                        opacity: fadeAnim,
                        transform: [{scale: scaleAnim}],
                    },
                ]}
            >
                {/* Логотип */}
                <View style={styles.logoContainer}>
                    <View style={styles.iconBackground}>
                        <Logo width={100} height={100}/>
                    </View>
                </View>

                {/* Название приложения */}
                <Animated.View
                    style={[
                        styles.textContainer,
                        {
                            transform: [{translateY: slideAnim}],
                        },
                    ]}
                >
                    <Text style={styles.appName}>Gear Up</Text>
                    <Text style={styles.tagline}>Изучение ПДД стало проще</Text>
                </Animated.View>

                {/* Индикатор загрузки */}
                <View style={styles.loadingContainer}>
                    <View style={styles.loadingBar}>
                        <Animated.View
                            style={[
                                styles.loadingProgress,
                                {
                                    width: progressAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: ['0%', '100%'],
                                    }),
                                },
                            ]}
                        />
                    </View>
                </View>
            </Animated.View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoContainer: {
        marginBottom: 40,
    },
    iconBackground: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(255,255,255,0.87)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textContainer: {
        alignItems: 'center',
        marginBottom: 60,
    },
    appName: {
        fontSize: 36,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 8,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: {width: 0, height: 2},
        textShadowRadius: 4,
    },
    tagline: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center',
        fontWeight: '300',
    },
    loadingContainer: {
        width: width * 0.6,
        alignItems: 'center',
    },
    loadingBar: {
        width: '100%',
        height: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 2,
        overflow: 'hidden',
    },
    loadingProgress: {
        height: '100%',
        backgroundColor: 'white',
        borderRadius: 2,
    },
});

import React, { useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {
    SafeAreaView,
    View,
    Text,
    TouchableOpacity,
    Image,
    ScrollView,
    FlatList,
    ActivityIndicator,
    Alert
} from 'react-native';
//Võ Ngân Khanh 2124802010728, Đồng Thị Huyền Trang 2124802010155

import { COLORS, FONTS, SIZES, icons, images } from '../constants';



const LineDivider = () => {
    return (
        <View style={{ width: 1, paddingVertical: 18 }}>
            <View style={{ flex: 1, borderLeftColor: COLORS.lightGray, borderLeftWidth: 1 }}></View>
        </View>
    )
}

const Home = ({ navigation }) => {
    const [profile, setProfile] = useState({ name: '', email: '', point: 200 });
    const [myBooks, setMyBooks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(1);
    const [loading, setLoading] = useState(true);
    const API_BASE_URL = 'http://192.168.20.22:5021';

    // Hàm xử lý đường dẫn ảnh
    const getImageSource = (book) => {
        console.log('Book data:', book); // Log dữ liệu sách
        console.log('Book cover path:', book.book_cover); // Log đường dẫn ảnh

        if (book.book_cover) {
            const imageUrl = book.book_cover; // URL đã đầy đủ từ API
            console.log('Full image URL:', imageUrl); // Log URL đầy đủ
            return { 
                uri: imageUrl,
                cache: 'reload' // Thêm cache option
            };
        }
        console.log('Using default image for:', book.book_name); // Log khi dùng ảnh mặc định
        return bookImages[book.book_name] || bookImages['Other Words For Home'];
    };

    // Hàm render ảnh
    const renderBookCover = (bookCover) => {
        return (
            <Image
                source={bookCover}
                resizeMode="cover"
                style={{
                    width: 180,
                    height: 250,
                    borderRadius: 20
                }}
                onError={(error) => console.log('Image loading error:', error.nativeEvent.error)}
            />
        );
    };

    // Hàm fetch sách
    const fetchBooks = async () => {
        try {
            setLoading(true);
            const username = await AsyncStorage.getItem('username');
            // Lấy thông tin user
            const userResponse = await axios.get(`${API_BASE_URL}/api/auth/user/${username}`);
            setProfile(prev => ({
                ...prev,
                name: userResponse.data.username,
                email: userResponse.data.email
            }));

            // Lấy danh sách sách
            const booksResponse = await axios.get(`${API_BASE_URL}/api/Book`);
            if (!booksResponse.data || booksResponse.data.length === 0) {
                setCategories([
                    { id: 1, categoryName: 'Best Seller', books: [] },
                    { id: 2, categoryName: 'The Latest', books: [] },
                    { id: 3, categoryName: 'Coming Soon', books: [] },
                ]);
                return;
            }

            // Phân loại sách vào 3 tab
            const bestSellers = booksResponse.data.filter(book => book.rating >= 4.5).map(book => ({
                ...book,
                bookName: book.book_name,
                bookCover: getImageSource(book),
                pageNo: book.page_no,
            }));
            const theLatest = booksResponse.data.filter(book => book.rating >= 4.0 && book.rating < 4.5).map(book => ({
                ...book,
                bookName: book.book_name,
                bookCover: getImageSource(book),
                pageNo: book.page_no,
            }));
            const comingSoon = booksResponse.data.filter(book => book.rating < 4.0).map(book => ({
                ...book,
                bookName: book.book_name,
                bookCover: getImageSource(book),
                pageNo: book.page_no,
            }));

            setCategories([
                { id: 1, categoryName: 'Best Seller', books: bestSellers },
                { id: 2, categoryName: 'The Latest', books: theLatest },
                { id: 3, categoryName: 'Coming Soon', books: comingSoon },
            ]);

            // Lấy 3 sách đầu tiên cho My Books
            const myBooksData = booksResponse.data.slice(0, 3).map(book => ({
                ...book,
                bookName: book.book_name,
                bookCover: getImageSource(book),
                pageNo: book.page_no,
                completion: "75%",
                lastRead: "3d 5h"
            }));
            setMyBooks(myBooksData);

        } catch (error) {
            setCategories([
                { id: 1, categoryName: 'Best Seller', books: [] },
                { id: 2, categoryName: 'The Latest', books: [] },
                { id: 3, categoryName: 'Coming Soon', books: [] },
            ]);
            if (error.response) {
                console.log('Error response:', error.response.data);
                console.log('Error status:', error.response.status);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    function renderHeader(profile) {
        return (
            <View style={{ flex: 1, flexDirection: 'row', paddingHorizontal: SIZES.padding, alignItems: 'center' }}>
                {/* Greetings */}
                <View style={{ flex: 1 }}>
                    <View style={{ marginRight: SIZES.padding }}>
                        <Text style={{ ...FONTS.h3, color: COLORS.white }}>Good Morning</Text>
                        <Text style={{ ...FONTS.h2, color: COLORS.white }}>{profile.name}</Text>
                    </View>
                </View>

                {/* Points */}
                <TouchableOpacity
                    style={{
                        backgroundColor: COLORS.primary,
                        height: 40,
                        paddingLeft: 3,
                        paddingRight: SIZES.radius,
                        borderRadius: 20
                    }}
                    onPress={() => { console.log("Point") }}
                >
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{ width: 30, height: 30, alignItems: 'center', justifyContent: 'center', borderRadius: 25, backgroundColor: 'rgba(0,0,0,0.5)' }}>
                            <Image
                                source={icons.plus_icon}
                                resizeMode="contain"
                                style={{
                                    width: 20,
                                    height: 20
                                }}
                            />
                        </View>

                        <Text style={{ marginLeft: SIZES.base, color: COLORS.white, ...FONTS.body3 }}>{profile.point} point</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    function renderButtonSection() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', padding: SIZES.padding }}>
                <View style={{ flexDirection: 'row', height: 70, backgroundColor: COLORS.secondary, borderRadius: SIZES.radius }}>
                    {/* Claim */}
                    <TouchableOpacity
                        style={{ flex: 1 }}
                        onPress={() => console.log("Claim")}
                    >
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <Image
                                source={icons.claim_icon}
                                resizeMode="contain"
                                style={{
                                    width: 30,
                                    height: 30
                                }}
                            />
                            <Text style={{ marginLeft: SIZES.base, ...FONTS.body3, color: COLORS.white }}>Claim</Text>
                        </View>
                    </TouchableOpacity>

                    {/* Divider */}
                    <LineDivider />

                    {/* Get Point */}
                    <TouchableOpacity
                        style={{ flex: 1 }}
                        onPress={() => console.log("Get Point")}
                    >
                        <View
                            style={{
                                flex: 1,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <Image
                                source={icons.point_icon}
                                resizeMode="contain"
                                style={{
                                    width: 30,
                                    height: 30
                                }}
                            />
                            <Text style={{ marginLeft: SIZES.base, ...FONTS.body3, color: COLORS.white }}>Get Point</Text>
                        </View>
                    </TouchableOpacity>

                    {/* Divider */}
                    <LineDivider />

                    {/* My Card */}
                    <TouchableOpacity
                        style={{ flex: 1 }}
                        onPress={() => console.log("My Card")}
                    >
                        <View
                            style={{
                                flex: 1,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <Image
                                source={icons.card_icon}
                                resizeMode="contain"
                                style={{
                                    width: 30,
                                    height: 30
                                }}
                            />
                            <Text style={{ marginLeft: SIZES.base, ...FONTS.body3, color: COLORS.white }}>My Card</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    function renderMyBookSection(myBooks) {
        const renderItem = ({ item, index }) => {
            return (
                <TouchableOpacity
                    style={{
                        flex: 1,
                        marginLeft: index == 0 ? SIZES.padding : 0,
                        marginRight: SIZES.radius
                    }}
                    onPress={() => navigation.navigate("BookDetail", {
                        book: item
                    })}
                >
                    {/* Book Cover */}
                    {renderBookCover(item.bookCover)}

                    {/* Book Info */}
                    <View style={{ marginTop: SIZES.radius, flexDirection: 'row', alignItems: 'center' }}>
                        <Image
                            source={icons.clock_icon}
                            style={{
                                width: 20,
                                height: 20,
                                tintColor: COLORS.lightGray
                            }}
                        />
                        <Text style={{ marginLeft: 5, ...FONTS.body3, color: COLORS.lightGray }}>{item.lastRead}</Text>

                        <Image
                            source={icons.page_icon}
                            style={{
                                marginLeft: SIZES.radius,
                                width: 20,
                                height: 20,
                                tintColor: COLORS.lightGray
                            }}
                        />
                        <Text style={{ marginLeft: 5, ...FONTS.body3, color: COLORS.lightGray }}>{item.completion}</Text>
                    </View>
                </TouchableOpacity>
            )
        }

        return (
            <View style={{ marginBottom: SIZES.padding }}>
                {/* Header */}
                <View style={{ paddingHorizontal: SIZES.padding, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ ...FONTS.h2, color: COLORS.white }}>My Book</Text>

                    <TouchableOpacity
                        onPress={() => console.log("See More")}
                    >
                        <Text style={{ ...FONTS.body3, color: COLORS.lightGray, alignSelf: 'flex-start', textDecorationLine: 'underline' }}>see more</Text>
                    </TouchableOpacity>
                </View>

                {/* Books */}
                <View style={{ marginTop: SIZES.padding }}>
                    <FlatList
                        data={myBooks}
                        renderItem={renderItem}
                        keyExtractor={item => `${item.id}`}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                    />
                </View>
            </View>
        )
    }

    function renderCategoryHeader() {
        // categories luôn là mảng 3 phần tử
        const renderItem = ({ item }) => (
            <TouchableOpacity
                style={{
                    marginRight: SIZES.padding,
                    paddingVertical: SIZES.base,
                    borderBottomWidth: selectedCategory === item.id ? 2 : 0,
                    borderBottomColor: selectedCategory === item.id ? COLORS.primary : 'transparent',
                    minWidth: 100,
                    alignItems: 'center',
                }}
                onPress={() => setSelectedCategory(item.id)}
            >
                <Text style={{
                    ...FONTS.h2,
                    color: selectedCategory === item.id ? COLORS.white : COLORS.lightGray,
                    textAlign: 'center'
                }}>
                    {item.categoryName}
                </Text>
            </TouchableOpacity>
        );
        return (
            <View style={{ flexDirection: 'row', paddingLeft: SIZES.padding }}>
                <FlatList
                    data={categories}
                    renderItem={renderItem}
                    keyExtractor={item => `${item.id}`}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingRight: SIZES.padding }}
                />
            </View>
        );
    }

    function renderCategoryData() {
        const selectedCategoryBooks = categories.find(c => c.id == selectedCategory)?.books || [];
        if (!selectedCategoryBooks.length) {
            return (
                <View style={{ padding: 24 }}>
                    <Text style={{ color: COLORS.lightGray, ...FONTS.h3 }}>Không có sách</Text>
                </View>
            );
        }
        const renderItem = ({ item }) => {
            return (
                <View style={{ marginVertical: SIZES.base }}>
                    <TouchableOpacity
                        style={{ flex: 1, flexDirection: 'row' }}
                        onPress={() => navigation.navigate("BookDetail", {
                            book: item
                        })}
                    >
                        {/* Book Cover */}
                        <Image
                            source={item.bookCover}
                            resizeMode="cover"
                            style={{ width: 100, height: 150, borderRadius: 10 }}
                        />
                        <View style={{ flex: 1, marginLeft: SIZES.radius }}>
                            {/* Book name and author */}
                            <View>
                                <Text style={{ paddingRight: SIZES.padding, ...FONTS.h2, color: COLORS.white }}>{item.bookName}</Text>
                                <Text style={{ ...FONTS.h3, color: COLORS.lightGray }}>{item.author}</Text>
                            </View>
                            {/* Book Info */}
                            <View style={{ flexDirection: 'row', marginTop: SIZES.radius }}>
                                <Image
                                    source={icons.page_filled_icon}
                                    resizeMode="contain"
                                    style={{ width: 20, height: 20, tintColor: COLORS.lightGray }}
                                />
                                <Text style={{ ...FONTS.body4, color: COLORS.lightGray, paddingHorizontal: SIZES.radius }}>{item.pageNo}</Text>
                                <Image
                                    source={icons.read_icon}
                                    resizeMode="contain"
                                    style={{ width: 20, height: 20, tintColor: COLORS.lightGray }}
                                />
                                <Text style={{ ...FONTS.body4, color: COLORS.lightGray, paddingHorizontal: SIZES.radius }}>{item.readed}</Text>
                            </View>
                            {/* Genre */}
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                style={{ marginTop: SIZES.base, width: '100%', maxWidth: '100%' }}
                                contentContainerStyle={{ paddingRight: SIZES.padding }}
                            >
                                {item.genre && JSON.parse(item.genre).map((genre, index) => (
                                    <View
                                        key={index}
                                        style={{
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            padding: SIZES.base,
                                            marginRight: SIZES.base,
                                            backgroundColor: genre === 'Adventure' ? COLORS.darkGreen :
                                                            genre === 'Romance' ? COLORS.darkRed :
                                                            COLORS.darkBlue,
                                            height: 40,
                                            borderRadius: SIZES.radius
                                        }}
                                    >
                                        <Text style={{
                                            ...FONTS.body3,
                                            color: genre === 'Adventure' ? COLORS.lightGreen :
                                                   genre === 'Romance' ? COLORS.lightRed :
                                                   COLORS.lightBlue
                                        }}>
                                            {genre}
                                        </Text>
                                    </View>
                                ))}
                            </ScrollView>
                        </View>
                    </TouchableOpacity>
                    {/* Bookmark Button */}
                    <TouchableOpacity
                        style={{ position: 'absolute', top: 5, right: 15 }}
                    >
                        <Image
                            source={icons.bookmark_icon}
                            resizeMode="contain"
                            style={{ width: 25, height: 25, tintColor: COLORS.lightGray }}
                        />
                    </TouchableOpacity>
                </View>
            )
        }
        return (
            <FlatList
                data={selectedCategoryBooks}
                renderItem={renderItem}
                keyExtractor={item => `${item.id}`}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingLeft: SIZES.padding }}
            />
        )
    }

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.black }}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    return (
        <SafeAreaView style={{ padding: 10, flex: 1, backgroundColor: COLORS.black }}>
            {/* Header Section */}
            <View style={{ height: 200 }}>
                {renderHeader(profile)}
                {renderButtonSection()}
            </View>

            {/* Body Section */}
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1, paddingBottom: 30 }}>
                {/* Books Section */}
                <View style={{ marginTop: SIZES.radius }}>
                    {renderMyBookSection(myBooks)}
                </View>

                {/* Categories Section */}
                <View style={{ marginTop: SIZES.padding, flex: 1 }}>
                    <View>
                        {renderCategoryHeader()}
                    </View>
                    <View style={{ flex: 1 }}>
                        {renderCategoryData()}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default Home; 
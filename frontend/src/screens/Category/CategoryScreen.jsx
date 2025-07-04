import { CartContext } from "../../utils/CartContext";
import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  Dimensions,
  Platform,
  StyleSheet,
} from "react-native";
import {
  useRoute,
  useNavigation,
  useFocusEffect,
} from "@react-navigation/native";
import { BASE_URL, getItemsByCategory } from "../../utils/api";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";

const { width: screenWidth } = Dimensions.get("window");

const keywordList = [
  "CHICKEN",
  "PANEER",
  "SCHEZWAN",
  "MUSHROOM",
  "KAJU",
  "GOBI",
  "EGG",
  "PRAWNS",
  "MANCHURIA",
];

const CategoryScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [, /*cart*/ setCart] = useState(incomingCart);
  const [foodItems, setFoodItems] = useState([]);
  const [selectedKeyword, setSelectedKeyword] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [vegOnly, setVegOnly] = useState(false);
  const [nonVegOnly, setNonVegOnly] = useState(false);
  const [sortOrder, setSortOrder] = useState("none");

  const {
    categoryId,
    category,
    cart: incomingCart = [],
    //cartCategory,
  } = route.params || {};

  useEffect(() => {
    if (!categoryId) return;
    getItemsByCategory(categoryId)
      .then((data) => setFoodItems(data))
      .catch((err) => console.error(err));
  }, [categoryId]);

  useFocusEffect(
    React.useCallback(() => {
      if (route.params?.cart) {
        setCart(route.params.cart);
      }
    }, [route.params?.cart])
  );

  const toggleKeyword = (word) =>
    setSelectedKeyword((prev) => (prev === word ? null : word));
  const toggleVeg = () => {
    setVegOnly(!vegOnly);
    if (!vegOnly) setNonVegOnly(false);
  };
  const toggleNonVeg = () => {
    setNonVegOnly(!nonVegOnly);
    if (!nonVegOnly) setVegOnly(false);
  };

  const sortItems = (a, b) => {
    if (sortOrder === "high") return b.price - a.price;
    if (sortOrder === "low") return a.price - b.price;
    return 0;
  };

  const filtered = (foodItems || [])
    .filter((item) => {
      const name = item.name?.toUpperCase() || "";
      const type = item.food_type?.toUpperCase() || "";
      const cat = item.category?.toUpperCase() || "";

      if (category && cat !== category.toUpperCase()) return false;
      if (vegOnly && type !== "VEG") return false;
      if (nonVegOnly && type !== "NON VEG") return false;
      if (searchQuery && !name.includes(searchQuery.toUpperCase()))
        return false;
      if (selectedKeyword && !name.includes(selectedKeyword)) return false;
      return true;
    })
    .sort(sortItems);

  const visibleKeywords = keywordList.filter((kw) =>
    (foodItems || []).some((item) => {
      const name = item.name?.toUpperCase() || "";
      const cat = item.category?.toUpperCase() || "";
      const type = item.food_type?.toUpperCase() || "";
      if (category && cat !== category.toUpperCase()) return false;
      if (vegOnly && type !== "VEG") return false;
      if (nonVegOnly && type !== "NON VEG") return false;
      return name.includes(kw);
    })
  );

  const renderFoodTypeIcon = (type) => (
    <View
      style={[styles.foodTypeBox, type === "VEG" ? styles.veg : styles.nonVeg]}
    >
      <View
        style={[
          styles.foodTypeDot,
          type === "VEG" ? styles.dotveg : styles.dotnonVeg,
        ]}
      />
    </View>
  );

  const { updateCartItem } = useContext(CartContext);

  const handleAddToCart = (item) => {
    updateCartItem(item.item_code, 1);
    navigation.navigate("Cartpage");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ padding: 10, flexDirection: "row", alignItems: "center" }}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>
          {(category || filtered[0]?.category || "Category").toUpperCase()}
        </Text>
      </View>
      <View>
        <TextInput
          style={styles.searchBar}
          placeholder="Search..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.filterRow}>
        <TouchableOpacity
          onPress={toggleVeg}
          style={[styles.filterButton, vegOnly && styles.activeButton]}
        >
          <View style={styles.iconLabel}>
            {renderFoodTypeIcon("VEG")}
            <Text style={styles.filterText}>Veg Only</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={toggleNonVeg}
          style={[styles.filterButton, nonVegOnly && styles.activeButton]}
        >
          <View style={styles.iconLabel}>
            {renderFoodTypeIcon("NON VEG")}
            <Text style={styles.filterText}>Non-Veg Only</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            setSortOrder((prev) => (prev === "high" ? "low" : "high"))
          }
          style={styles.filterButton}
        >
          <Text style={styles.filterText}>
            {sortOrder === "high" ? "Low Price " : "High Price "}
          </Text>
        </TouchableOpacity>
      </View>

      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.keywordScroll}
        >
          {visibleKeywords.map((word) => (
            <TouchableOpacity
              key={word}
              onPress={() => toggleKeyword(word)}
              style={[
                styles.keywordButton,
                selectedKeyword === word && styles.activeKeywordButton,
              ]}
            >
              <Text
                style={[
                  styles.keywordText,
                  selectedKeyword === word && styles.activeKeywordText,
                ]}
              >
                {word}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View>
        <ScrollView contentContainerStyle={styles.itemsContainer}>
          <View style={styles.itemsGrid}>
            {filtered.length === 0 ? (
              <Text style={styles.noItems}>No items found</Text>
            ) : (
              filtered.map((item) => (
                <View key={item.id} style={styles.foodBlock}>
                  <Image
                    source={{
                      uri: `${BASE_URL}${item.image_url}`,
                    }}
                    style={styles.foodImage}
                    resizeMode="cover"
                  />
                  <BlurView
                    intensity={100}
                    tint="dark"
                    style={styles.foodInfoOverlay}
                  >
                    <View style={styles.foodtop}>
                      {renderFoodTypeIcon(item.food_type?.toUpperCase())}
                      <Text style={styles.foodName}>{item.name}</Text>
                    </View>
                    <View style={styles.foodmiddle}>
                      <Text style={styles.foodcat}>{item.combo_type}</Text>
                      <Text style={styles.foodSubcontent}>
                        {[item.subcontent] || "Tasty treat"}
                      </Text>
                    </View>
                    <View style={styles.foodbottom}>
                      <Text style={styles.foodPrice}>₹{item.price}</Text>
                      <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => handleAddToCart(item)}
                      >
                        <Text style={styles.addButtonText}>Add</Text>
                      </TouchableOpacity>
                    </View>
                  </BlurView>
                </View>
              ))
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default CategoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    marginTop: 20,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: { fontSize: 18, fontWeight: "bold" },
  searchBar: {
    margin: 15,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
    borderColor: "#ccc",
  },
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#eee",
    borderRadius: 10,
    marginBottom: 8,
  },
  activeButton: {
    borderWidth: 2,
    borderColor: "#87CEEB",
  },
  iconLabel: {
    flexDirection: "row",
    alignItems: "center",
  },
  foodTypeBox: {
    width: 16,
    height: 16,
    borderRadius: 3,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 6,
  },
  foodTypeDot: {
    width: 8,
    height: 8,
    borderRadius: 5,
  },
  dotveg: {
    backgroundColor: "green",
  },
  dotnonVeg: {
    backgroundColor: "red",
  },
  veg: {
    borderColor: "green",
  },
  nonVeg: {
    borderColor: "red",
  },
  keywordScroll: {
    paddingHorizontal: 10,
    paddingBottom: 10,
    height: 48,
  },
  keywordButton: {
    backgroundColor: "#eee",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    height: 36,
    justifyContent: "center",
  },
  activeKeywordButton: {
    backgroundColor: "#007bff",
  },
  keywordText: {
    color: "#000",
    fontWeight: "bold",
  },
  activeKeywordText: {
    color: "#fff",
  },
  itemsContainer: {
    paddingHorizontal: 10,
    paddingBottom: 250,
  },
  itemsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: Platform.OS === "web" ? "flex-start" : "center",
    gap: 12,
  },
  foodBlock: {
    width: Platform.OS === "web" ? (screenWidth - 60) / 2 : screenWidth - 20,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#000",
    marginBottom: 20,
  },
  foodImage: {
    width: "100%",
    height: screenWidth > 600 ? 400 : 370,
    borderRadius: 10,
  },
  foodInfoOverlay: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 10,
  },
  foodtop: {
    flexDirection: "row",
    alignItems: "center",
  },
  foodmiddle: {
    flexDirection: "row",
  },
  foodbottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 2,
    borderColor: "#fff",
    marginTop: 3,
  },
  foodName: {
    marginLeft: 5,
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  foodcat: {
    color: "#fff",
    fontSize: 12,
    marginRight: 15,
  },
  foodPrice: {
    color: "#fff",
    fontSize: 14,
  },
  foodSubcontent: {
    color: "#ddd",
    fontSize: 12,
  },
  addButton: {
    backgroundColor: "#ff6347",
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignSelf: "flex-start",
    borderRadius: 4,
    marginTop: 10,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 12,
  },
  noItems: {
    textAlign: "center",
    marginTop: 30,
    color: "#666",
    fontSize: 16,
  },
});

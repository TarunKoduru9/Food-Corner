import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import API from "../../utils/api";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const [usersRes, ordersRes, revenueRes, catRes, itemsRes] = await Promise.all([
        API.get("/admin/stats/users-count"),
        API.get("/admin/stats/orders-count"),
        API.get("/admin/stats/total-revenue"),
        API.get("/admin/stats/categories-count"),
        API.get("/admin/stats/items-count"),
      ]);

      setStats({
        users: usersRes.data.count,
        orders: ordersRes.data.count,
        revenue: revenueRes.data.total,
        categories: catRes.data.count,
        items: itemsRes.data.count,
      });
    } catch (error) {
      console.error("Error loading dashboard stats", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Admin Dashboard</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Total Users</Text>
        <Text style={styles.value}>{stats?.users}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Total Orders</Text>
        <Text style={styles.value}>{stats?.orders}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Total Revenue</Text>
        <Text style={styles.value}>₹{stats?.revenue}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Categories</Text>
        <Text style={styles.value}>{stats?.categories}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Food Items</Text>
        <Text style={styles.value}>{stats?.items}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#f4f4f4",
    padding: 20,
    borderRadius: 8,
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: "#555",
  },
  value: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
});

export default AdminDashboard;

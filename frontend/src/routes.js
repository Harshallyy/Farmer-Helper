import Index from "views/Index.js";
import Profile from "views/examples/Profile.js";
import Orders from "views/examples/Orders";
import Inventory from "views/examples/Inventory";
import Messages from "views/examples/Messages";

import ConsumerBrowse from "views/consumer/Browse.js";
import ConsumerOrders from "views/consumer/Orders.js";
import ConsumerMessages from "views/consumer/Messages.js";
import ConsumerProfile from "views/consumer/Profile.js";

// Farmer-side navigation, rendered under /farmer/*
export const farmerRoutes = [
	{
		path: "/index",
		name: "Dashboard",
		icon: "ni ni-tv-2 text-primary",
		component: Index,
		layout: "/farmer",
	},
	{
		path: "/orders",
		name: "Orders",
		icon: "ni ni-planet text-orange",
		component: Orders,
		layout: "/farmer",
	},
	{
		path: "/inventory",
		name: "Inventory",
		icon: "ni ni-box-2 text-green",
		component: Inventory,
		layout: "/farmer",
	},
	{
		path: "/messages",
		name: "Messages",
		icon: "ni ni-chat-round text-info",
		component: Messages,
		layout: "/farmer",
	},
	{
		path: "/user-profile",
		name: "My Profile",
		icon: "ni ni-single-02 text-yellow",
		component: Profile,
		layout: "/farmer",
	},
	{
		path: "/logout",
		name: "Logout",
		icon: "ni ni-key-25 text-info",
		layout: "",
	},
];

// Consumer-side navigation, rendered under /consumer/*
export const consumerRoutes = [
	{
		path: "/index",
		name: "Browse Produce",
		icon: "ni ni-shop text-primary",
		component: ConsumerBrowse,
		layout: "/consumer",
	},
	{
		path: "/orders",
		name: "My Orders",
		icon: "ni ni-cart text-orange",
		component: ConsumerOrders,
		layout: "/consumer",
	},
	{
		path: "/messages",
		name: "Messages",
		icon: "ni ni-chat-round text-info",
		component: ConsumerMessages,
		layout: "/consumer",
	},
	{
		path: "/user-profile",
		name: "My Profile",
		icon: "ni ni-single-02 text-yellow",
		component: ConsumerProfile,
		layout: "/consumer",
	},
	{
		path: "/logout",
		name: "Logout",
		icon: "ni ni-key-25 text-info",
		layout: "",
	},
];

export default farmerRoutes;

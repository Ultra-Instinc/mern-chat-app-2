import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Auth from "./pages/auth";
import Chat from "./pages/chat";
import Profile from "./pages/profile";
import { ReactNode, useEffect, useState } from "react";
//@ts-ignore
import { useAppStore } from "./store/index";
import { apiClient } from "./lib/api-client";
import { GET_USER_INFO } from "./utils/constants";
import Cube from "./pages/cube";
import Example from "./pages/example";
import SideBarDemo from "./pages/sidebar";

const PrivateRoute = ({ children }: { children: ReactNode }) => {
	const { userInfo } = useAppStore();
	const isAuthentocated = !!userInfo;
	return isAuthentocated ? children : <Navigate to='/auth' />;
};

const AuthRoute = ({ children }: { children: ReactNode }) => {
	const { userInfo } = useAppStore();
	const isAuthentocated = !!userInfo;
	return isAuthentocated ? <Navigate to='/chat' /> : children;
};

export default function App() {
	const { userInfo, setUserInfo } = useAppStore();
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		const getUserData = async () => {
			try {
				const res = await apiClient.get(GET_USER_INFO, {
					withCredentials: true,
				});
				if (res.status === 200 && res.data.id) {
					setUserInfo(res.data);
				} else {
					setUserInfo(undefined);
				}
			} catch (error) {
				setUserInfo(undefined);
			} finally {
				setLoading(false);
			}
		};
		if (!userInfo) getUserData();
		else setLoading(false);
	}, []);
	if (loading) return <div>Loading...</div>;
	return (
		<BrowserRouter>
			<Routes>
				<Route
					path='/auth'
					element={
						<AuthRoute>
							<Auth />
						</AuthRoute>
					}
				/>
				<Route
					path='/chat'
					element={
						<PrivateRoute>
							<Chat />
						</PrivateRoute>
					}
				/>
				<Route
					path='/profile'
					element={
						<PrivateRoute>
							<Profile />
						</PrivateRoute>
					}
				/>
				<Route
					path='/cube'
					element={<Cube />}
				/>
				<Route
					path='/sidebar'
					element={<SideBarDemo />}
				/>
				<Route
					path='/media-query'
					element={<Example />}
				/>
				<Route
					path='*'
					element={<Navigate to='/auth' />}
				/>
			</Routes>
		</BrowserRouter>
	);
}

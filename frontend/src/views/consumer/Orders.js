import { useEffect, useState } from "react";
import { Card, CardHeader, Table, Spinner } from "reactstrap";
import Header from "components/Headers/Header.js";
import api, { getErrorMessage } from "Common/api";
import { badNotification } from "Common/Notification";

// GET /consumer/order - matches orders explicitly linked to this consumer
// account. Farmers currently record orders with free-text buyer details
// rather than a consumer account link, so this list reflects only orders a
// farmer has associated with your account.
const ConsumerOrders = () => {
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		api
			.get("consumer/order")
			.then((res) => {
				if (res.data.statusCode === 200) {
					setOrders(res.data.result);
				} else {
					badNotification(res.data.message || "Unable to fetch orders");
				}
			})
			.catch((err) => badNotification(getErrorMessage(err, "Unable to fetch orders")))
			.finally(() => setLoading(false));
	}, []);

	return (
		<>
			<Header />
			<div className="container-fluid mt--7">
				<div className="row">
					<div className="col">
						<Card className="shadow modern-card">
							<CardHeader className="border-0">
								<h3 className="mb-0">My Orders</h3>
							</CardHeader>
							{loading ? (
								<div className="text-center py-5">
									<Spinner color="primary" />
								</div>
							) : orders.length === 0 ? (
								<div className="text-center text-muted py-5">
									<i className="ni ni-cart h1 d-block mb-2" />
									No orders linked to your account yet.
								</div>
							) : (
								<Table className="align-items-center table-flush" responsive>
									<thead className="thead-light">
										<tr>
											<th scope="col">Item</th>
											<th scope="col">Quantity</th>
											<th scope="col">Price</th>
											<th scope="col">Status</th>
										</tr>
									</thead>
									<tbody>
										{orders.map((order) => (
											<tr key={order._id}>
												<td>{order.itemId?.crop ?? "-"}</td>
												<td>
													{order.quantity} {order.units}
												</td>
												<td>&#8377; {order.price}</td>
												<td>
													<span className={`status-chip ${Number(order.status) === 1 ? "status-completed" : "status-pending"}`}>
														{Number(order.status) === 0 ? "Pending" : "Completed"}
													</span>
												</td>
											</tr>
										))}
									</tbody>
								</Table>
							)}
						</Card>
					</div>
				</div>
			</div>
		</>
	);
};

export default ConsumerOrders;

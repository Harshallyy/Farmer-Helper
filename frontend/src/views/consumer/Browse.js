import { useEffect, useState } from "react";
import {
	Card,
	CardHeader,
	CardBody,
	Spinner,
	Button,
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Form,
	FormGroup,
	Label,
	Input,
} from "reactstrap";
import Header from "components/Headers/Header.js";
import api, { getErrorMessage } from "Common/api";
import { badNotification, goodNotification } from "Common/Notification";

// Browse produce listed by farmers (GET /consumer/inventory) and message a
// farmer about an item. There is no "place order" endpoint exposed to
// consumers on the backend, so ordering happens by messaging the farmer.
const Browse = () => {
	const [items, setItems] = useState([]);
	const [loading, setLoading] = useState(true);
	const [contact, setContact] = useState(null);
	const [message, setMessage] = useState("");
	const [sending, setSending] = useState(false);

	const getInventory = () => {
		setLoading(true);

		api
			.get("consumer/inventory")
			.then((res) => {
				if (res.data.statusCode === 200) {
					setItems(res.data.result);
				} else {
					badNotification(
						res.data.message || "Unable to fetch listings",
					);
				}
			})
			.catch((err) =>
				badNotification(
					getErrorMessage(err, "Unable to fetch listings"),
				),
			)
			.finally(() => setLoading(false));
	};

	useEffect(() => {
		getInventory();
	}, []);

	const openContact = (item) => {
		setContact(item);
		setMessage(
			`Hi, I'm interested in ${item.quantity} ${item.units} of ${item.crop}. Is it still available?`,
		);
	};

	const sendMessage = () => {
		if (!contact?.farmerId?._id) {
			badNotification("This item has no farmer attached");
			return;
		}

		setSending(true);

		api
			.post("consumer/message/send", {
				farmer: contact.farmerId._id,
				message,
			})
			.then((res) => {
				if (res.data.statusCode === 200) {
					goodNotification(
						"Message sent",
						`Your message was sent to ${contact.farmerId.username}`,
					);

					setContact(null);
					setMessage("");
				} else {
					badNotification(
						res.data.message || "Unable to send message",
					);
				}
			})
			.catch((err) =>
				badNotification(
					getErrorMessage(err, "Unable to send message"),
				),
			)
			.finally(() => setSending(false));
	};

	return (
		<>
			<Header />

			<main className="container-fluid mt--7 marketplace-page">
				<div className="row">
					<div className="col-12">
						<Card className="marketplace-card">
							<CardHeader className="marketplace-header">
								<div>
									<div className="marketplace-eyebrow">
										<i className="fas fa-store" />
										Marketplace
									</div>

									<h1 className="marketplace-title mb-1">
										Browse Produce
									</h1>

									<p className="marketplace-subtitle mb-0">
										Fresh produce listed by farmers on the
										platform
									</p>
								</div>

								<div className="marketplace-count">
									<i className="fas fa-box-open" />
									<span>
										{items.length}{" "}
										{items.length === 1
											? "listing"
											: "listings"}
									</span>
								</div>
							</CardHeader>

							<CardBody className="marketplace-body">
								<Modal
									isOpen={!!contact}
									toggle={() => setContact(null)}
									className="marketplace-modal"
									centered
								>
									<ModalHeader
										toggle={() => setContact(null)}
									>
										<div className="modal-title-wrap">
											<span className="modal-icon">
												<i className="fas fa-comments" />
											</span>

											<div>
												<div className="modal-title-label">
													Contact farmer
												</div>

												<div className="modal-title-name">
													{contact?.farmerId
														?.username ?? "Farmer"}
												</div>
											</div>
										</div>
									</ModalHeader>

									<ModalBody>
										<Form>
											<FormGroup>
												<Label>Selected item</Label>

												<Input
													disabled
													className="glass-input"
													value={
														contact
															? `${contact.crop} • ${contact.quantity} ${contact.units} • ₹${contact.price}`
															: ""
													}
												/>
											</FormGroup>

											<FormGroup className="mb-0">
												<Label>Message</Label>

												<Input
													type="textarea"
													rows="5"
													className="glass-input"
													value={message}
													onChange={(e) =>
														setMessage(
															e.target.value,
														)
													}
													placeholder="Write your message..."
												/>
											</FormGroup>
										</Form>
									</ModalBody>

									<ModalFooter>
										<Button
											className="marketplace-send-btn"
											onClick={sendMessage}
											disabled={
												sending || !message.trim()
											}
										>
											{sending ? (
												<Spinner size="sm" />
											) : (
												<>
													<i className="fas fa-paper-plane me-2" />
													Send message
												</>
											)}
										</Button>

										<Button
											className="marketplace-cancel-btn"
											onClick={() => setContact(null)}
										>
											Cancel
										</Button>
									</ModalFooter>
								</Modal>

								{loading ? (
									<div className="marketplace-empty">
										<div className="marketplace-loader">
											<Spinner color="primary" />
										</div>

										<h5>Loading produce...</h5>

										<p className="mb-0">
											Fetching the latest farmer
											listings.
										</p>
									</div>
								) : items.length === 0 ? (
									<div className="marketplace-empty">
										<div className="marketplace-empty-icon">
											<i className="fas fa-seedling" />
										</div>

										<h4>No produce listed yet</h4>

										<p className="mb-0">
											Farmers haven't added any produce
											to the marketplace yet.
										</p>
									</div>
								) : (
									<div className="produce-grid">
										{items.map((item) => (
											<article
												key={item._id}
												className="produce-card"
											>
												<div className="produce-card-top">
													<div className="produce-icon">
														<i className="fas fa-leaf" />
													</div>

													<span className="produce-badge">
														Available
													</span>
												</div>

												<h2 className="produce-name">
													{item.crop}
												</h2>

												<div className="produce-details">
													<div className="produce-detail">
														<span>
															<i className="fas fa-weight-hanging" />
															Quantity
														</span>

														<strong>
															{item.quantity}{" "}
															{item.units}
														</strong>
													</div>

													<div className="produce-detail">
														<span>
															<i className="fas fa-tag" />
															Price
														</span>

														<strong className="produce-price">
															₹ {item.price}
														</strong>
													</div>

													<div className="produce-detail">
														<span>
															<i className="fas fa-user" />
															Farmer
														</span>

														<strong>
															{item.farmerId
																?.username ??
																"-"}
														</strong>
													</div>
												</div>

												<Button
													className="produce-contact-btn"
													onClick={() =>
														openContact(item)
													}
												>
													<i className="fas fa-comments me-2" />
													Contact farmer
												</Button>
											</article>
										))}
									</div>
								)}
							</CardBody>
						</Card>
					</div>
				</div>
			</main>
		</>
	);
};

export default Browse;
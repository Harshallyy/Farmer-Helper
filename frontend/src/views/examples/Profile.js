// reactstrap components
import { Button, Card, CardHeader, CardBody, FormGroup, Form, Input, Spinner } from "reactstrap";
// core components
import UserHeader from "components/Headers/UserHeader";
import { useState, useEffect } from "react";
import api, { getErrorMessage } from "Common/api";
import { badNotification, goodNotification } from "Common/Notification";

const Profile = ({ role = "farmer" }) => {
	const [oldPassword, setOldPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmNewPassword, setConfirmNewPassword] = useState("");
	const [username, setUsername] = useState("");
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		let isMounted = true;
		api
			.get(`${role}/details`)
			.then((res) => {
				if (isMounted && res.data.statusCode === 200) {
					setUsername(res.data.result.username);
				}
			})
			.catch((err) => badNotification(getErrorMessage(err, "Unable to load your profile")))
			.finally(() => isMounted && setLoading(false));
		return () => {
			isMounted = false;
		};
	}, [role]);

	const handleChangePassword = async (e) => {
		e.preventDefault();

		if (newPassword !== confirmNewPassword) {
			badNotification("New passwords should match");
			return;
		}

		setSaving(true);
		try {
			const res = await api.post(`${role}/changePassword`, { oldPassword, newPassword });
			if (res.data.statusCode === 200) {
				goodNotification("Success", "Password changed successfully");
				setOldPassword("");
				setNewPassword("");
				setConfirmNewPassword("");
			} else {
				badNotification(res.data.message || "Old password is incorrect");
			}
		} catch (err) {
			badNotification(getErrorMessage(err, "Old password is incorrect"));
		} finally {
			setSaving(false);
		}
	};

	return (
		<>
			<UserHeader username={loading ? "" : username} />
			<div className="container-fluid mt--7">
				<div className="row">
					<div className="col-xl-12">
						<Card className="bg-secondary shadow modern-card">
							<CardHeader className="bg-white border-0">
								<div className="row align-items-center">
									<div className="col-8">
										<h3 className="mb-0">My account</h3>
									</div>
								</div>
							</CardHeader>
							<CardBody>
								<h6 className="heading-small text-muted mb-4">Change Password</h6>
								<div className="ps-lg-4">
									<Form onSubmit={handleChangePassword}>
										<div className="row">
											<div className="col-lg-4">
												<FormGroup>
													<label>Old Password</label>
													<Input
														className="form-control-alternative"
														type="password"
														value={oldPassword}
														onChange={(e) => setOldPassword(e.target.value)}
														required
													/>
												</FormGroup>
											</div>
											<div className="col-lg-4">
												<FormGroup>
													<label>New Password</label>
													<Input
														className="form-control-alternative"
														type="password"
														value={newPassword}
														onChange={(e) => setNewPassword(e.target.value)}
														required
													/>
												</FormGroup>
											</div>
											<div className="col-lg-4">
												<FormGroup>
													<label>Confirm New Password</label>
													<Input
														className="form-control-alternative"
														type="password"
														value={confirmNewPassword}
														onChange={(e) => setConfirmNewPassword(e.target.value)}
														required
													/>
												</FormGroup>
											</div>
										</div>
										<Button color="primary" type="submit" disabled={saving}>
											{saving ? <Spinner size="sm" /> : "Change Password"}
										</Button>
									</Form>
								</div>
							</CardBody>
						</Card>
					</div>
				</div>
			</div>
		</>
	);
};

export default Profile;

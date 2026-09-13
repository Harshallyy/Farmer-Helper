import { useState } from "react";
// reactstrap components
import {
  Button,
  Card,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupText,
  InputGroup,
  Spinner,
} from "reactstrap";
import api, { getErrorMessage } from "Common/api";
import { badNotification, goodNotification } from "Common/Notification";
import { Link } from "react-router-dom";

const Login = ({ refresh }) => {
  const [role, setRole] = useState("farmer"); // "farmer" | "consumer"
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post(`${role}/login`, { username, password });
      if (res.data.statusCode === 200) {
        localStorage.setItem("token", res.data.token);
        refresh();
        goodNotification("Success", "Signed in successfully");
      } else {
        badNotification(
          res.data.message || "Username or password is incorrect",
        );
      }
    } catch (err) {
      badNotification(
        getErrorMessage(err, "Username or password is incorrect"),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="col-lg-5 col-md-7 auth-form-shell">
      <div className="role-switch mb-3" role="tablist" aria-label="Sign in as">
        <button
          type="button"
          className={`role-switch-btn ${role === "farmer" ? "active" : ""}`}
          onClick={() => setRole("farmer")}
        >
          <i className="ni ni-square-pin me-1" /> Farmer
        </button>
        <button
          type="button"
          className={`role-switch-btn ${role === "consumer" ? "active" : ""}`}
          onClick={() => setRole("consumer")}
        >
          <i className="ni ni-cart me-1" /> Consumer
        </button>
      </div>
      <Card className="bg-secondary shadow border-0 modern-card auth-card-inner">
        <CardBody className="px-lg-5 py-lg-5">
          <div className="text-center text-muted mb-4 auth-form-header">
            <small>Sign in as a {role}</small>
          </div>
          <Form role="form" onSubmit={handleSubmit} className="auth-form">
            <FormGroup className="mb-3">
              <label className="auth-form-label" htmlFor="login-username">
                Username
              </label>
              <InputGroup className="input-group-alternative">
                <InputGroupText>
                  <i className="ni ni-email-83" />
                </InputGroupText>
                <Input
                  id="login-username"
                  placeholder="Enter your username"
                  type="text"
                  autoComplete="username"
                  onChange={(e) => setUsername(e.target.value)}
                  value={username}
                  required
                />
              </InputGroup>
            </FormGroup>
            <FormGroup>
              <label className="auth-form-label" htmlFor="login-password">
                Password
              </label>
              <InputGroup className="input-group-alternative">
                <InputGroupText>
                  <i className="ni ni-lock-circle-open" />
                </InputGroupText>
                <Input
                  id="login-password"
                  placeholder="Enter your password"
                  type="password"
                  autoComplete="current-password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  required
                />
              </InputGroup>
            </FormGroup>
            <div className="text-center">
              <Button
                className="my-4 w-100 auth-submit-btn"
                color="primary"
                type="submit"
                disabled={loading}
              >
                {loading ? <Spinner size="sm" /> : "Sign in"}
              </Button>
            </div>
          </Form>
        </CardBody>
      </Card>
      <div className="row mt-3 auth-secondary-row">
        <div className="col-6" />
        <div className="col-6 text-end">
          <Link className="text-light auth-secondary-link" to="/auth/register">
            <small>Create new account</small>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

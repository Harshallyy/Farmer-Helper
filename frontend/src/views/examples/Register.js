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
import { useNavigate, Link } from "react-router-dom";
import { goodNotification, badNotification } from "Common/Notification";

const Register = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("farmer"); // "farmer" | "consumer"
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post(`${role}/add`, { username, password });
      if (res.data.statusCode === 200) {
        navigate("/auth/login");
        goodNotification(
          "Registration successful",
          "Please sign in to continue",
        );
      } else {
        badNotification(
          res.data.message ||
            "This username is taken. Please use another username",
        );
      }
    } catch (err) {
      badNotification(
        getErrorMessage(
          err,
          "This username is taken. Please use another username",
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="col-lg-5 col-md-7 auth-form-shell">
      <div className="role-switch mb-3" role="tablist" aria-label="Register as">
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
            <small>Sign up as a {role}</small>
          </div>
          <Form role="form" onSubmit={handleSubmit} className="auth-form">
            <FormGroup>
              <label className="auth-form-label" htmlFor="register-username">
                Username
              </label>
              <InputGroup className="input-group-alternative mb-3">
                <InputGroupText>
                  <i className="ni ni-email-83" />
                </InputGroupText>
                <Input
                  id="register-username"
                  placeholder="Choose a username"
                  type="text"
                  autoComplete="username"
                  onChange={(e) => setUsername(e.target.value)}
                  value={username}
                  required
                />
              </InputGroup>
            </FormGroup>
            <FormGroup>
              <label className="auth-form-label" htmlFor="register-password">
                Password
              </label>
              <InputGroup className="input-group-alternative">
                <InputGroupText>
                  <i className="ni ni-lock-circle-open" />
                </InputGroupText>
                <Input
                  id="register-password"
                  placeholder="Create a password"
                  type="password"
                  autoComplete="new-password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  required
                />
              </InputGroup>
            </FormGroup>
            <div className="text-center">
              <Button
                className="mt-4 w-100 auth-submit-btn"
                color="primary"
                type="submit"
                disabled={loading}
              >
                {loading ? <Spinner size="sm" /> : "Create account"}
              </Button>
            </div>
          </Form>
        </CardBody>
      </Card>
      <div className="row mt-3 auth-secondary-row">
        <div className="col-6" />
        <div className="col-6 text-end">
          <Link className="text-light auth-secondary-link" to="/auth/login">
            <small>Already have an account? Sign in</small>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;

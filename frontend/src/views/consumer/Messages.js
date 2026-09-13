import { useEffect, useState } from "react";
import { Card, CardHeader, CardBody, Spinner, Button, Input } from "reactstrap";
import Header from "components/Headers/Header.js";
import api, { getErrorMessage } from "Common/api";
import { badNotification, goodNotification } from "Common/Notification";

const ConsumerMessages = () => {
  const [messages, setMessages] = useState([]);
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFarmer, setSelectedFarmer] = useState("");
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  const loadMessages = () => {
    setLoading(true);

    api
      .get("consumer/message")
      .then((res) => {
        if (res.data.statusCode === 200) {
          setMessages(res.data.result);
        } else {
          badNotification(res.data.message || "Unable to fetch messages");
        }
      })
      .catch((err) =>
        badNotification(getErrorMessage(err, "Unable to fetch messages")),
      )
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadMessages();

    // Farmers are derived from produce listings because
    // there is no dedicated "list farmers" endpoint.
    api
      .get("consumer/inventory")
      .then((res) => {
        if (res.data.statusCode === 200) {
          const unique = new Map();

          res.data.result.forEach((item) => {
            if (item.farmerId?._id) {
              unique.set(item.farmerId._id, item.farmerId.username);
            }
          });

          const list = Array.from(unique, ([id, username]) => ({
            id,
            username,
          }));

          setFarmers(list);

          if (list.length > 0) {
            setSelectedFarmer(list[0].id);
          }
        }
      })
      .catch(() => {
        // Farmer picker is best-effort.
      });
  }, []);

  const send = () => {
    if (!selectedFarmer || !text.trim()) return;

    setSending(true);

    api
      .post("consumer/message/send", {
        farmer: selectedFarmer,
        message: text,
      })
      .then((res) => {
        if (res.data.statusCode === 200) {
          goodNotification("Sent", "Message sent");
          setText("");
          loadMessages();
        } else {
          badNotification(res.data.message || "Unable to send message");
        }
      })
      .catch((err) =>
        badNotification(getErrorMessage(err, "Unable to send message")),
      )
      .finally(() => setSending(false));
  };

  return (
    <>
      <Header />

      <main className="container-fluid messages-page">
        <div className="row">
          {/* Messages */}
          <div className="col-lg-8 mb-4 mb-lg-0">
            <Card className="shadow modern-card messages-card">
              <CardHeader className="border-0 messages-card-header">
                <div>
                  <span className="messages-eyebrow">
                    <i className="fas fa-comments" />
                    Communication
                  </span>

                  <h3 className="mb-0">Messages</h3>

                  <p className="mb-0">Your conversations with farmers</p>
                </div>

                <span className="messages-count">
                  {messages.length}{" "}
                  {messages.length === 1 ? "message" : "messages"}
                </span>
              </CardHeader>

              <CardBody>
                {loading ? (
                  <div className="messages-empty">
                    <Spinner color="primary" />

                    <p>Loading your messages...</p>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="messages-empty">
                    <div className="messages-empty-icon">
                      <i className="fas fa-comments" />
                    </div>

                    <h4>No messages yet</h4>

                    <p>Your conversations with farmers will appear here.</p>
                  </div>
                ) : (
                  <div className="message-thread">
                    {messages.map((m) => (
                      <div
                        key={m._id}
                        className={`message-bubble ${
                          m.from === 1 ? "me" : "them"
                        }`}
                      >
                        <div className="message-meta">
                          {m.from === 1
                            ? "You"
                            : (m.farmer?.username ?? "Farmer")}
                        </div>

                        <div className="message-text">{m.message}</div>
                      </div>
                    ))}
                  </div>
                )}
              </CardBody>
            </Card>
          </div>

          {/* New Message */}
          <div className="col-lg-4">
            <Card className="shadow modern-card messages-compose-card">
              <CardHeader className="border-0">
                <div>
                  <span className="messages-eyebrow">
                    <i className="fas fa-paper-plane" />
                    Start a conversation
                  </span>

                  <h4 className="mb-0">New Message</h4>
                </div>
              </CardHeader>

              <CardBody>
                <div className="message-form-group">
                  <label htmlFor="farmer-select" className="message-form-label">
                    Select farmer
                  </label>

                  <Input
                    id="farmer-select"
                    type="select"
                    className="message-glass-input mb-3"
                    value={selectedFarmer}
                    onChange={(e) => setSelectedFarmer(e.target.value)}
                    disabled={farmers.length === 0}
                  >
                    {farmers.length === 0 && (
                      <option value="">No farmers found</option>
                    )}

                    {farmers.map((farmer) => (
                      <option key={farmer.id} value={farmer.id}>
                        {farmer.username}
                      </option>
                    ))}
                  </Input>
                </div>

                <div className="message-form-group">
                  <label htmlFor="message-text" className="message-form-label">
                    Your message
                  </label>

                  <Input
                    id="message-text"
                    type="textarea"
                    rows="5"
                    className="message-glass-input mb-3"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type your message..."
                  />
                </div>

                <Button
                  className="message-send-btn w-100"
                  onClick={send}
                  disabled={sending || !text.trim() || !selectedFarmer}
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
              </CardBody>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
};

export default ConsumerMessages;

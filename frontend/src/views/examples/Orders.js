import {
  Form,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Badge,
  Card,
  CardHeader,
  Label,
  Table,
  FormGroup,
  Input,
  Button,
  Spinner,
} from "reactstrap";

import Header from "components/Headers/Header.js";
import { useCallback, useEffect, useState } from "react";
import api, { getErrorMessage } from "Common/api";
import { badNotification, goodNotification } from "Common/Notification";

const FILTERS = [
  { id: 0, label: "All", className: "filter-all" },
  { id: 1, label: "Pending", className: "filter-pending" },
  { id: 2, label: "Completed", className: "filter-completed" },
];

const EMPTY_ORDER = {
  itemId: null,
  quantity: 0,
  units: "Kg",
  price: 0,
  consumerName: "",
  consumerEmail: "",
  consumerPhone: "",
};

const Orders = () => {
  const [filter, setFilter] = useState(0);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modal, setModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editOrder, setEditOrder] = useState(null);
  const [newOrder, setNewOrder] = useState({ ...EMPTY_ORDER });
  const [inventory, setInventory] = useState([]);

  const filteredOrders = orders.filter((order) => {
    if (filter === 1) return Number(order.status) === 0;
    if (filter === 2) return Number(order.status) === 1;
    return true;
  });

  const fetchOrders = useCallback(async () => {
    setLoading(true);

    try {
      const res = await api.get("farmer/order");

      if (res.data?.statusCode === 200) {
        setOrders(res.data.result || []);
      } else {
        badNotification(res.data?.message || "Unable to fetch orders");
      }
    } catch (err) {
      badNotification(getErrorMessage(err, "Unable to fetch orders"));
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchInventory = useCallback(async () => {
    try {
      const res = await api.get("farmer/inventory");

      if (res.data?.statusCode === 200) {
        const result = res.data.result || [];

        setInventory(result);

        if (result.length > 0) {
          setNewOrder((prev) => ({
            ...prev,
            itemId: prev.itemId || result[0]._id,
          }));
        }
      } else {
        badNotification(res.data?.message || "Unable to fetch inventory");
      }
    } catch (err) {
      badNotification(getErrorMessage(err, "Unable to fetch inventory"));
    }
  }, []);

  const confirmEdit = async () => {
    if (!editOrder || saving) return;

    setSaving(true);

    const payload = {
      ...editOrder,
      quantity: Number(editOrder.quantity),
      price: Number(editOrder.price),
      status: Number(editOrder.status),
    };

    try {
      const res = await api.put(`farmer/order/${editOrder._id}`, payload);

      if (res.data?.statusCode === 200) {
        goodNotification("Success", "Order updated successfully");

        setEditIndex(null);
        setEditOrder(null);
        await fetchOrders();
      } else {
        badNotification(res.data?.message || "Unable to edit order");
      }
    } catch (err) {
      badNotification(getErrorMessage(err, "Unable to edit order"));
    } finally {
      setSaving(false);
    }
  };

  const addOrder = async () => {
    if (!newOrder.itemId) {
      badNotification("Please add an item to the inventory");
      return;
    }

    if (saving) return;

    setSaving(true);

    const payload = {
      itemId: newOrder.itemId,
      quantity: Number(newOrder.quantity),
      units: newOrder.units,
      price: Number(newOrder.price),
      consumerName: newOrder.consumerName,
      consumerEmail: newOrder.consumerEmail,
      consumerPhone: newOrder.consumerPhone,
    };

    try {
      const res = await api.post("farmer/order", payload);

      if (res.data?.statusCode === 200) {
        goodNotification("Added Order", "Order added successfully");

        setModal(false);
        setNewOrder({
          ...EMPTY_ORDER,
          itemId: inventory[0]?._id || null,
        });

        await fetchOrders();
      } else {
        badNotification(res.data?.message || "Unable to add order");
      }
    } catch (err) {
      badNotification(getErrorMessage(err, "Unable to add order"));
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (order) => {
    if (editIndex === order._id) {
      setEditIndex(null);
      setEditOrder(null);
      return;
    }

    setEditIndex(order._id);

    setEditOrder({
      _id: order._id,
      itemId: order.itemId?._id || order.itemId || "",
      quantity: order.quantity ?? 0,
      units: order.units || "Kg",
      price: order.price ?? 0,
      consumerName: order.consumerName || "",
      consumerEmail: order.consumerEmail || "",
      consumerPhone: order.consumerPhone || "",
      status: Number(order.status) || 0,
    });
  };

  useEffect(() => {
    fetchInventory();
    fetchOrders();
  }, [fetchInventory, fetchOrders]);

  return (
    <>
      <Header />

      <div className="container-fluid mt--7">
        <div className="row">
          <div className="col">
            <Card className="shadow modern-card">
              <CardHeader className="border-0 d-flex align-items-center justify-content-between flex-wrap gap-2">
                <div className="filter-pills">
                  {FILTERS.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      className={`filter-pill ${f.className} ${
                        filter === f.id ? "active" : ""
                      }`}
                      onClick={() => setFilter(f.id)}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                <Button
                  color="primary"
                  className="btn-icon"
                  onClick={() => setModal(true)}
                  disabled={saving}
                >
                  <i className="ni ni-fat-add me-1" />
                  Add Order
                </Button>
              </CardHeader>

              <Modal isOpen={modal} toggle={() => !saving && setModal(!modal)}>
                <ModalHeader toggle={() => !saving && setModal(!modal)}>
                  Add Order
                </ModalHeader>

                <ModalBody>
                  <Form>
                    <FormGroup>
                      <Label>Crop</Label>
                      <Input
                        type="select"
                        value={newOrder.itemId || ""}
                        onChange={(e) =>
                          setNewOrder({
                            ...newOrder,
                            itemId: e.target.value,
                          })
                        }
                      >
                        {inventory.map((crop) => (
                          <option key={crop._id} value={crop._id}>
                            {crop.crop}
                          </option>
                        ))}
                      </Input>
                    </FormGroup>

                    <FormGroup>
                      <Label>Quantity</Label>
                      <Input
                        type="number"
                        min="0"
                        value={newOrder.quantity}
                        onChange={(e) =>
                          setNewOrder({
                            ...newOrder,
                            quantity: e.target.value,
                          })
                        }
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label>Units</Label>
                      <Input
                        type="text"
                        value={newOrder.units}
                        onChange={(e) =>
                          setNewOrder({
                            ...newOrder,
                            units: e.target.value,
                          })
                        }
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label>Price</Label>
                      <Input
                        type="number"
                        min="0"
                        value={newOrder.price}
                        onChange={(e) =>
                          setNewOrder({
                            ...newOrder,
                            price: e.target.value,
                          })
                        }
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label>Consumer Name</Label>
                      <Input
                        type="text"
                        value={newOrder.consumerName}
                        onChange={(e) =>
                          setNewOrder({
                            ...newOrder,
                            consumerName: e.target.value,
                          })
                        }
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label>Consumer Email</Label>
                      <Input
                        type="email"
                        value={newOrder.consumerEmail}
                        onChange={(e) =>
                          setNewOrder({
                            ...newOrder,
                            consumerEmail: e.target.value,
                          })
                        }
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label>Consumer Phone</Label>
                      <Input
                        type="tel"
                        value={newOrder.consumerPhone}
                        onChange={(e) =>
                          setNewOrder({
                            ...newOrder,
                            consumerPhone: e.target.value,
                          })
                        }
                      />
                    </FormGroup>
                  </Form>
                </ModalBody>

                <ModalFooter>
                  <Button color="primary" onClick={addOrder} disabled={saving}>
                    {saving ? <Spinner size="sm" /> : "Add"}
                  </Button>

                  <Button
                    color="secondary"
                    outline
                    onClick={() => setModal(false)}
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                </ModalFooter>
              </Modal>

              {loading ? (
                <div className="text-center py-5">
                  <Spinner color="primary" />
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="text-center text-muted py-5">
                  <i className="ni ni-cart h1 d-block mb-2" />
                  No orders match this filter.
                </div>
              ) : (
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">Consumer Name</th>
                      <th scope="col">Item Name</th>
                      <th scope="col">Quantity</th>
                      <th scope="col">Price</th>
                      <th scope="col">Status</th>
                      <th scope="col">Edit</th>
                      <th scope="col" />
                    </tr>
                  </thead>

                  <tbody>
                    {filteredOrders.map((order) => (
                      <tr key={order._id}>
                        <td>
                          {editIndex !== order._id ? (
                            <span className="text-sm font-weight-bold">
                              {order.consumerName}
                            </span>
                          ) : (
                            <Input
                              type="text"
                              value={editOrder?.consumerName || ""}
                              onChange={(e) =>
                                setEditOrder({
                                  ...editOrder,
                                  consumerName: e.target.value,
                                })
                              }
                            />
                          )}
                        </td>

                        <td>
                          {editIndex !== order._id ? (
                            <span>{order.itemId?.crop || "—"}</span>
                          ) : (
                            <Input
                              type="select"
                              value={editOrder?.itemId || ""}
                              onChange={(e) =>
                                setEditOrder({
                                  ...editOrder,
                                  itemId: e.target.value,
                                })
                              }
                            >
                              {inventory.map((crop) => (
                                <option key={crop._id} value={crop._id}>
                                  {crop.crop}
                                </option>
                              ))}
                            </Input>
                          )}
                        </td>

                        <td>
                          {editIndex !== order._id ? (
                            <Badge color="" className="badge-dot">
                              {order.quantity} {order.units || "Kg"}
                            </Badge>
                          ) : (
                            <FormGroup row className="mb-0">
                              <div className="col-7">
                                <Input
                                  type="number"
                                  min="0"
                                  value={editOrder?.quantity ?? 0}
                                  onChange={(e) =>
                                    setEditOrder({
                                      ...editOrder,
                                      quantity: e.target.value,
                                    })
                                  }
                                />
                              </div>

                              <div className="col-5">
                                <Input
                                  type="text"
                                  value={editOrder?.units || "Kg"}
                                  onChange={(e) =>
                                    setEditOrder({
                                      ...editOrder,
                                      units: e.target.value,
                                    })
                                  }
                                />
                              </div>
                            </FormGroup>
                          )}
                        </td>

                        <td>
                          {editIndex !== order._id ? (
                            <span>&#8377; {order.price}</span>
                          ) : (
                            <Input
                              type="number"
                              min="0"
                              value={editOrder?.price ?? 0}
                              onChange={(e) =>
                                setEditOrder({
                                  ...editOrder,
                                  price: e.target.value,
                                })
                              }
                            />
                          )}
                        </td>

                        <td>
                          {editIndex !== order._id ? (
                            <span
                              className={`status-chip ${
                                Number(order.status) === 1
                                  ? "status-completed"
                                  : "status-pending"
                              }`}
                            >
                              {Number(order.status) === 0
                                ? "Pending"
                                : "Completed"}
                            </span>
                          ) : (
                            <Input
                              type="select"
                              value={editOrder?.status ?? 0}
                              onChange={(e) =>
                                setEditOrder({
                                  ...editOrder,
                                  status: e.target.value,
                                })
                              }
                            >
                              <option value="0">Pending</option>
                              <option value="1">Completed</option>
                            </Input>
                          )}
                        </td>

                        <td>
                          <Button
                            size="sm"
                            color="secondary"
                            outline
                            onClick={() => handleEdit(order)}
                            disabled={saving}
                          >
                            {editIndex !== order._id ? "Edit" : "Cancel"}
                          </Button>
                        </td>

                        <td className="text-end">
                          {editIndex === order._id && (
                            <Button
                              size="sm"
                              color="primary"
                              onClick={confirmEdit}
                              disabled={saving}
                            >
                              {saving ? <Spinner size="sm" /> : "Confirm"}
                            </Button>
                          )}
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

export default Orders;

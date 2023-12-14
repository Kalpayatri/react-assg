import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  CssBaseline,
  Grid,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogContent,
  Autocomplete,
} from "@mui/material";
import { Formik, Form, Field } from "formik";
import { validationSchema } from "../utils/validationSchema";
import axios from "axios";
import { connect, useDispatch } from "react-redux";
import { addUser, deleteUser, updateUser } from "../redux/actions/userActions";

const Homepage = ({ user, addUser, deleteUser, updateUser }) => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const dispatch = useDispatch();

  //Api
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get(
          "https://countriesnow.space/api/v0.1/countries/states"
        );
        setCountries(response.data);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, []);

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleDelete = (email) => {
    dispatch(deleteUser(email));
    setSelectedUser(null);
    setIsEditModalOpen(false);
  };

  const handleUpdate = (values, actions) => {
    console.log(selectedUser.email, values);
    const updatedUserData = { ...selectedUser, ...values };

    dispatch(updateUser({ email: selectedUser.email, updatedUserData }));

    setSelectedUser(null);
    setIsEditModalOpen(false);
  };

  const handleSubmit = (values, actions) => {
    console.log(values);
    actions.setSubmitting(false);

    dispatch(addUser(values));
    setIsFormSubmitted(true);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "whitesmoke",
      }}
    >
      <Container component="main" maxWidth="sm">
        <CssBaseline />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: "white",
            borderRadius: "8px",
            padding: "24px",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          {!isFormSubmitted ? (
            <>
              <Typography variant="h5" component="h1">
                Create User
              </Typography>
              <Formik
                initialValues={{
                  firstname: "",
                  lastname: "",
                  email: "",
                  mobileNumber: "",
                  addressOne: "",
                  addressTwo: "",
                  state: "",
                  city: "",
                  country: "",
                  zipcode: "",
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({
                  isSubmitting,
                  touched,
                  errors,
                  values,
                  setFieldValue,
                  handleChange,
                }) => (
                  <Form style={{ width: "100%", marginTop: "16px" }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Field
                          as={TextField}
                          name="firstname"
                          label="First Name"
                          variant="outlined"
                          fullWidth
                          error={touched.firstname && Boolean(errors.firstname)}
                          helperText={touched.firstname && errors.firstname}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Field
                          as={TextField}
                          name="lastname"
                          label="Last Name"
                          variant="outlined"
                          fullWidth
                          error={touched.lastname && Boolean(errors.lastname)}
                          helperText={touched.lastname && errors.lastname}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Field
                          as={TextField}
                          name="email"
                          label="Email Id"
                          variant="outlined"
                          fullWidth
                          error={touched.email && Boolean(errors.email)}
                          helperText={touched.email && errors.email}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Field
                          as={TextField}
                          name="mobileNumber"
                          label="Mobile Number"
                          variant="outlined"
                          fullWidth
                          error={
                            touched.mobileNumber && Boolean(errors.mobileNumber)
                          }
                          helperText={
                            touched.mobileNumber && errors.mobileNumber
                          }
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Field
                          as={TextField}
                          name="addressOne"
                          label="Address 1"
                          variant="outlined"
                          fullWidth
                          error={
                            touched.addressOne && Boolean(errors.addressOne)
                          }
                          helperText={touched.addressOne && errors.addressOne}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Field
                          as={TextField}
                          name="addressTwo"
                          label="Address 2 (Optional)"
                          variant="outlined"
                          fullWidth
                          error={
                            touched.addressTwo && Boolean(errors.addressTwo)
                          }
                          helperText={touched.addressTwo && errors.addressTwo}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Field
                          as={TextField}
                          name="country"
                          label="Country"
                          variant="outlined"
                          fullWidth
                          select
                          value={values.country}
                          error={touched.country && Boolean(errors.country)}
                          helperText={touched.country && errors.country}
                          onChange={(e) => {
                            const selectedCountry = countries.data.find(
                              (country) => country.name === e.target.value
                            );
                            setStates(
                              selectedCountry ? selectedCountry.states : []
                            );
                            handleChange(e);
                          }}
                        >
                          {countries.data &&
                            countries.data.map((country) => (
                              <MenuItem key={country.name} value={country.name}>
                                {country.name}
                              </MenuItem>
                            ))}
                        </Field>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Autocomplete
                          options={Array.isArray(states) ? states : []}
                          getOptionLabel={(state) => state.name}
                          fullWidth
                          value={
                            Array.isArray(states) &&
                            states.find((state) => state.name === values.state)
                          }
                          onChange={(e, selectedOption) => {
                            setFieldValue("state", selectedOption?.name);
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              name="state"
                              label="State"
                              variant="outlined"
                              error={touched.state && Boolean(errors.state)}
                              helperText={touched.state && errors.state}
                            />
                          )}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Field
                          as={TextField}
                          name="city"
                          label="City"
                          variant="outlined"
                          fullWidth
                          error={touched.city && Boolean(errors.city)}
                          helperText={touched.city && errors.city}
                        ></Field>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Field
                          as={TextField}
                          name="zipcode"
                          label="Zip Code"
                          variant="outlined"
                          fullWidth
                          error={touched.zipcode && Boolean(errors.zipcode)}
                          helperText={touched.zipcode && errors.zipcode}
                        />
                      </Grid>
                    </Grid>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: "16px",
                      }}
                    >
                      <Button
                        variant="contained"
                        style={{ backgroundColor: "#EFD01B", color: "black" }}
                        type="submit"
                        fullWidth
                      >
                        Submit
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>
            </>
          ) : (
            <div style={{ position: "fixed", top: 0, left: 0, right: 0 }}>
              <TableContainer component={Paper} style={{ marginTop: "16px" }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>First Name</TableCell>
                      <TableCell>Last Name</TableCell>
                      <TableCell>Email Id</TableCell>
                      <TableCell>Mobile Number</TableCell>
                      <TableCell>address One</TableCell>
                      <TableCell>address Two</TableCell>
                      <TableCell>Country</TableCell>
                      <TableCell>State</TableCell>
                      <TableCell>City</TableCell>
                      <TableCell>Zip Code</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {user.users.map((currentUser) => (
                      <TableRow key={currentUser.id}>
                        <TableCell>{currentUser.firstname}</TableCell>
                        <TableCell>{currentUser.lastname}</TableCell>
                        <TableCell>{currentUser.email}</TableCell>
                        <TableCell>{currentUser.mobileNumber}</TableCell>
                        <TableCell>{currentUser.addressOne}</TableCell>
                        <TableCell>{currentUser.addressTwo}</TableCell>
                        <TableCell>{currentUser.country}</TableCell>
                        <TableCell>{currentUser.state}</TableCell>
                        <TableCell>{currentUser.city}</TableCell>
                        <TableCell>{currentUser.zipcode}</TableCell>

                        <TableCell style={{ display: "flex", gap: "8px" }}>
                          <Button
                            variant="contained"
                            style={{
                              backgroundColor: "#EFD01B",
                              color: "black",
                              marginRight: "8px",
                            }}
                            onClick={() => handleEdit(currentUser)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            onClick={() => handleDelete(currentUser.email)}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Dialog
                open={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
              >
                <DialogContent>
                  {selectedUser && (
                    <Formik
                      initialValues={selectedUser}
                      validationSchema={validationSchema}
                      onSubmit={(values, actions) => {
                        handleUpdate({ id: selectedUser.id, ...values });
                        actions.setSubmitting(false);
                        setIsEditModalOpen(false);
                      }}
                    >
                      {({
                        isSubmitting,
                        touched,
                        errors,
                        values,
                        setFieldValue,
                      }) => (
                        <Form style={{ width: "100%", marginTop: "16px" }}>
                          <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                              <Field
                                as={TextField}
                                name="firstname"
                                label="First Name"
                                variant="outlined"
                                fullWidth
                                error={
                                  touched.firstname && Boolean(errors.firstname)
                                }
                                helperText={
                                  touched.firstname && errors.firstname
                                }
                              />
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <Field
                                as={TextField}
                                name="lastname"
                                label="Last Name"
                                variant="outlined"
                                fullWidth
                                error={
                                  touched.lastname && Boolean(errors.lastname)
                                }
                                helperText={touched.lastname && errors.lastname}
                              />
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <Field
                                as={TextField}
                                name="email"
                                label="Email Id"
                                variant="outlined"
                                fullWidth
                                error={touched.email && Boolean(errors.email)}
                                helperText={touched.email && errors.email}
                              />
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <Field
                                as={TextField}
                                name="mobileNumber"
                                label="Mobile Number"
                                variant="outlined"
                                fullWidth
                                error={
                                  touched.mobileNumber &&
                                  Boolean(errors.mobileNumber)
                                }
                                helperText={
                                  touched.mobileNumber && errors.mobileNumber
                                }
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <Field
                                as={TextField}
                                name="addressOne"
                                label="Address 1"
                                variant="outlined"
                                fullWidth
                                error={
                                  touched.addressOne &&
                                  Boolean(errors.addressOne)
                                }
                                helperText={
                                  touched.addressOne && errors.addressOne
                                }
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <Field
                                as={TextField}
                                name="addressTwo"
                                label="Address 2 (Optional)"
                                variant="outlined"
                                fullWidth
                                error={
                                  touched.addressTwo &&
                                  Boolean(errors.addressTwo)
                                }
                                helperText={
                                  touched.addressTwo && errors.addressTwo
                                }
                              />
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <Field
                                as={TextField}
                                name="country"
                                label="Country"
                                variant="outlined"
                                fullWidth
                                select
                                disabled
                                value={values.country}
                                error={
                                  touched.country && Boolean(errors.country)
                                }
                                helperText={touched.country && errors.country}
                              >
                                {countries.data &&
                                  countries.data.map((country) => (
                                    <MenuItem
                                      key={country.name}
                                      value={country.name}
                                    >
                                      {country.name}
                                    </MenuItem>
                                  ))}
                              </Field>
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <Autocomplete
                                options={Array.isArray(states) ? states : []}
                                getOptionLabel={(state) => state.name}
                                fullWidth
                                value={
                                  Array.isArray(states) &&
                                  states.find(
                                    (state) => state.name === values.state
                                  )
                                }
                                onChange={(e, selectedOption) => {
                                  setFieldValue("state", selectedOption?.name);
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    name="state"
                                    label="State"
                                    variant="outlined"
                                    error={
                                      touched.state && Boolean(errors.state)
                                    }
                                    helperText={touched.state && errors.state}
                                  />
                                )}
                              />
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <Field
                                as={TextField}
                                name="city"
                                label="City"
                                variant="outlined"
                                fullWidth
                                error={touched.city && Boolean(errors.city)}
                                helperText={touched.city && errors.city}
                              ></Field>
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <Field
                                as={TextField}
                                name="zipcode"
                                label="Zip Code"
                                variant="outlined"
                                fullWidth
                                error={
                                  touched.zipcode && Boolean(errors.zipcode)
                                }
                                helperText={touched.zipcode && errors.zipcode}
                              />
                            </Grid>
                          </Grid>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              marginTop: "16px",
                            }}
                          >
                            <Button
                              variant="contained"
                              style={{
                                backgroundColor: "#EFD01B",
                                color: "black",
                              }}
                              type="submit"
                              fullWidth
                            >
                              Update
                            </Button>
                          </div>
                        </Form>
                      )}
                    </Formik>
                  )}
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.user,
});

const mapDispatchToProps = (dispatch) => ({
  addUser: (userData) => dispatch(addUser(userData)),
  deleteUser: (userId) => dispatch(deleteUser(userId)),
  updateUser: (userData) => dispatch(updateUser(userData)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Homepage);

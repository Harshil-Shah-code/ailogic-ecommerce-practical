import { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { storeAuthCredentials, type LoginPayload } from "../../store/slices/AuthSlice";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../store/hooks";
import { FiEye, FiEyeOff, FiAlertCircle } from "react-icons/fi";

const VALID_EMAIL =
  import.meta.env.VITE_EMAIL;

const VALID_PASSWORD =
  import.meta.env.VITE_PASSWORD;

export const Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const validationSchema = Yup.object({
    email: Yup.string()
      .required("Email is required")
      .email("Please enter a valid email address"),
    password: Yup.string().required("Password is required"),
  });

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xs border border-gray-200 p-8 sm:p-10">
        <div className="text-center mb-8">
          <p className="text-sm text-gray-500 mt-1">
            Sign in to access your e-commerce platform
          </p>
        </div>

        {authError && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
            <FiAlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{authError}</span>
          </div>
        )}

        <Formik<LoginPayload>
          initialValues={{ email: "", password: "" }}
          validationSchema={validationSchema}
          enableReinitialize={true}
          onSubmit={(values, { setSubmitting }) => {
            setAuthError(null);
            const isEmailValid = values.email === VALID_EMAIL;
            const isPasswordValid = values.password === VALID_PASSWORD;

            if (isEmailValid && isPasswordValid) {
              dispatch(storeAuthCredentials(values));
              navigate("/products");
            } else {
              setAuthError(`Invalid credentials. Please use ${VALID_EMAIL} and ${VALID_PASSWORD}.`);
            }
            setSubmitting(false);
          }}
        >
          {({ isSubmitting, setFieldValue }) => (
            <Form className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Field
                    id="email"
                    type="email"
                    name="email"
                    placeholder="e.g. admin@test.com"
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 shadow-2xs outline-hidden transition"
                  />
                </div>
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-xs mt-1 font-medium"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5"
                >
                  Password
                </label>
                <div className="relative">
                  <Field
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    className="w-full px-3.5 py-2.5 pr-10 text-sm bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 shadow-2xs outline-hidden transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 focus:outline-hidden cursor-pointer"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <FiEyeOff className="w-5 h-5" />
                    ) : (
                      <FiEye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-xs mt-1 font-medium"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setFieldValue("email", VALID_EMAIL);
                    setFieldValue("password", VALID_PASSWORD);
                    setAuthError(null);
                  }}
                  className="text-xs text-cyan-600 hover:text-cyan-800 hover:underline cursor-pointer"
                >
                  Fill demo credentials
                </button>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 text-white font-semibold rounded-xl text-sm transition shadow-xs hover:shadow cursor-pointer flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};
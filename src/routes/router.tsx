import { createBrowserRouter } from "react-router";

import { AppLayout } from "@/components/AppLayout/AppLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute/ProtectedRoute";

import { Admin } from "@/pages/Admin/Admin";
import { ChangePassword } from "@/pages/ChangePassword/ChangePassword";
import { Department } from "@/pages/Department/Department";
import { Drafts } from "@/pages/Drafts/Drafts";
import { Home } from "@/pages/Home/Home";
import { Login } from "@/pages/Login/Login";
import { Procedure } from "@/pages/Procedure/Procedure";
import { ProcedureForm } from "@/pages/ProcedureForm/ProcedureForm";

export const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />,
    },

    {
        path: "/change-password",
        element: <ChangePassword />,
    },

    {
        element: <ProtectedRoute />,

        children: [
            {
                path: "/",
                element: <AppLayout />,

                children: [
                    {
                        index: true,
                        element: <Home />,
                    },

                    {
                        path: "admin",
                        element: <Admin />,
                    },

                    {
                        path: "drafts",
                        element: <Drafts />,
                    },

                    // Compatibilidade com a rota antiga.
                    {
                        path: "procedures/drafts",
                        element: <Drafts />,
                    },

                    // Mantém compatibilidade com a rota antiga.
                    {
                        path: "departments/:departmentId",
                        element: (
                            <Department section="procedures" />
                        ),
                    },

                    {
                        path: "departments/:departmentId/procedures",
                        element: (
                            <Department section="procedures" />
                        ),
                    },

                    {
                        path: "departments/:departmentId/documents",
                        element: (
                            <Department section="documents" />
                        ),
                    },

                    {
                        path: "procedures/new",
                        element: <ProcedureForm />,
                    },

                    {
                        path: "procedures/:procedureId",
                        element: <Procedure />,
                    },

                    {
                        path: "procedures/:procedureId/edit",
                        element: <ProcedureForm />,
                    },
                ],
            },
        ],
    },
]);
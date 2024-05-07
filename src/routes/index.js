import React from "react"
import PathConstants from "./pathConstants"

const Home = React.lazy(() => import("../pages/Home"))
const Team = React.lazy(() => import("../pages/Team"))
const Portfolio = React.lazy(() => import("../pages/Portfolio"))
const About = React.lazy(() => import("../pages/About"))
const Grid = React.lazy(() => import("../pages/Grid"))
const GridSVG = React.lazy(() => import("../pages/GridSVG"))

const Dungeon = React.lazy(() => import('../pages/Dungeon'))
const routes = [
    { path: PathConstants.DUNGEON, element: <Dungeon /> },

    { path: PathConstants.HOME, element: <Home /> },
    { path: PathConstants.TEAM, element: <Team /> },
    { path: PathConstants.PORTFOLIO, element: <Portfolio /> },
    { path: PathConstants.ABOUT, element: <About /> },
    { path: PathConstants.GRID, element: <Grid />},
    { path: PathConstants.GRIDSVG, element: <GridSVG />},
]
export default routes

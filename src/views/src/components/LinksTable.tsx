import { FC } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
    Box,
} from "@mui/material";
import { Link } from "../types/link";

interface LinksTableProps {
    links: Link[]; // Список ссылок
}

const LinksTable: FC<LinksTableProps> = ({ links }) => {
    return (
        <Box marginTop={4}>
            <Typography variant="h6" marginBottom={2}>
                Все ссылки
            </Typography>

            {links.length === 0 ? (
                <Typography variant="body1" color="textSecondary" marginTop={2}>
                    Список ссылок пуст.
                </Typography>
            ) : (
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Оригинальный URL</TableCell>
                            <TableCell>Короткая ссылка</TableCell>
                            <TableCell>Дата создания</TableCell>
                            <TableCell>Количество переходов</TableCell>
                            <TableCell>Время жизни</TableCell>
                            <TableCell>Аналитика</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {links.map((link) => (
                            <TableRow key={link.shortUrl}>
                                <TableCell>
                                    <a
                                        href={link.originalUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {link.originalUrl}
                                    </a>
                                </TableCell>
                                <TableCell>
                                    <a
                                        href={`http://localhost:3000/api/${link.shortUrl}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        http://localhost:3000/api/{link.shortUrl}
                                    </a>
                                </TableCell>
                                <TableCell>{new Date(link.createdAt).toLocaleString()}</TableCell>
                                <TableCell>{link.clickCount}</TableCell>
                                <TableCell>
                                    {link.expiresAt
                                        ? new Date(link.expiresAt).toLocaleString()
                                        : "Нет срока действия"}
                                </TableCell>
                                <TableCell>
                                    <a
                                        href={`http://localhost:3000/api/analytics/${link.shortUrl}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Аналитика
                                    </a>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </Box>
    );
};

export default LinksTable;

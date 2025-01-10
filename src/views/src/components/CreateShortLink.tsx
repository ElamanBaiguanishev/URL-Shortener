import { FC, useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import { urlService } from "../api/UserService";

interface CreateShortLinkProps {
  onLinkCreated: () => Promise<void>; // Функция уведомления о создании ссылки
}

const CreateShortLink: FC<CreateShortLinkProps> = ({ onLinkCreated }) => {
  const [originalUrl, setOriginalUrl] = useState("");
  const [alias, setAlias] = useState("");
  const [expiresAt, setExpiresAt] = useState<string | undefined>(undefined);
  const [error, setError] = useState("");
  const [shortUrl, setShortUrl] = useState("");

  const handleGenerate = async () => {
    setError("");
    setShortUrl("");

    if (!originalUrl) {
      setError("Введите URL!");
      return;
    }

    try {
      const link = await urlService.createShortUrl(
        originalUrl,
        alias || undefined,
        expiresAt
      );
      setShortUrl(link.shortUrl);
      await onLinkCreated(); // Уведомляем родителя об обновлении списка
    } catch (err: any) {
      setError(err.response?.data?.message || "Ошибка при создании короткой ссылки");
    }
  };

  return (
    <Box>
      <Typography variant="h6" marginBottom={2}>
        Создать короткую ссылку
      </Typography>

      <TextField
        label="Введите оригинальный URL"
        variant="outlined"
        fullWidth
        margin="normal"
        value={originalUrl}
        onChange={(e) => setOriginalUrl(e.target.value)}
      />

      <TextField
        label="Введите alias (опционально)"
        variant="outlined"
        fullWidth
        margin="normal"
        value={alias}
        onChange={(e) => setAlias(e.target.value)}
      />

      <TextField
        label="Установить дату истечения (опционально)"
        type="datetime-local"
        variant="outlined"
        fullWidth
        margin="normal"
        value={expiresAt || ""}
        onChange={(e) => setExpiresAt(e.target.value || undefined)}
        InputLabelProps={{
          shrink: true,
        }}
      />

      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleGenerate}
        sx={{ marginTop: 2 }}
      >
        Генерировать короткую ссылку
      </Button>

      {shortUrl && (
        <Typography variant="body1" color="green" marginTop={2}>
          Короткая ссылка:{" "}
          <a href={`http://localhost:3000/api/${shortUrl}`}>{shortUrl}</a>
        </Typography>
      )}

      {error && (
        <Typography variant="body1" color="red" marginTop={2}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default CreateShortLink;

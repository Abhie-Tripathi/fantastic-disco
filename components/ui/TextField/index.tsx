import type { TextFieldProps, ValidationResult } from "react-aria-components";
import {
  FieldError,
  Input,
  Label,
  Text,
  TextField,
} from "react-aria-components";
import styles from "./textfield.module.css";

interface MyTextFieldProps extends TextFieldProps {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
}

export function MyTextField({
  label,
  description,
  errorMessage,
  ...props
}: MyTextFieldProps) {
  return (
    <TextField {...props} className={styles.textfield}>
      <Label className={styles.textlabel}>{label}</Label>
      <Input className={styles.textinput} />
      {description && (
        <Text className={styles.textarea} slot="description">
          {description}
        </Text>
      )}
      <FieldError>{errorMessage}</FieldError>
    </TextField>
  );
}
